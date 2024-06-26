const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
authMiddlewares = require("../middlewares/authMiddlewares");
const nodemailer = require('nodemailer');
const passport = require("./passport")
const multer = require("multer");
const { bucket } = require('./firebase');
const Jimp = require("jimp")
require('dotenv').config();


const client = require('./redisClient'); 

const upload = multer({
  storage: multer.memoryStorage()
});

const verificationCodes = {};


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP server host
  port: 465, // Replace with your SMTP server port
  secure: true, // false for TLS, true for SSL
  auth: {
    user: process.env.EMAIL, // Replace with your email address
    pass: process.env.PASS, // Replace with your email password
  },
});


// registration
router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error("user already exist");
    }
    if (req.body.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    // password hashing
    const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    

    verificationCodes[req.body.email] = VerificationCode;

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedpass;
    req.body.status = 'pending'; // Set user status to 'pending'

    //new user
    const NewUser = new User(req.body);
    await NewUser.save();


    await transporter.sendMail({
      from: 'azheebilal@gmail.com',
      to: req.body.email,
      subject: 'Verification Code for Registration',
      text: `Your verification code is: ${VerificationCode}`,
    });

    res.send({
      success: true,
      message: "User created successfully. Check your email for the verification code.",
      email : req.body.email
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
router.post("/verify", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email  });
   
    const storedVerificationCode = verificationCodes[email];
   
    if (user && storedVerificationCode === verificationCode) {
      // Update user status to 'active'
      user.status = 'active';
      await user.save();

      res.send({
        success: true,
        message: "Email verification successful. Redirecting to login page...",
      });
    } else {
      throw new Error("Invalid verification code");
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// login 


router.post('/login',async(req,res)=>{
  
try {
    const user = await User.findOne({ email: req.body.email });
if(!user){
    throw new Error('user does not exist')
}
if(user.status !== 'active'){
    throw new Error('The User is Blocked')
}
//compare pass

const validpass = await bcrypt.compare(
    req.body.password,
    user.password,
)

if(!validpass){
    throw new Error('invalid password');
}
 const token = jwt.sign({userId : user._id},process.env.jwt_secret ,{expiresIn : '2d'});
// success

res.send({
    success:true,
    message : "logged in successfully",
    data : token,
})
} catch (error) {
    res.send({
        success : false,
        message : error.message,
       
    })
}
})


// get current user

router.get('/get-current-user', authMiddlewares, async (req, res) => {
  try {
      const userId = req.body.userId; // Ensure you're getting the correct user ID, possibly from req.user or similar
      // const cacheKey = `user:${userId}`;

      // // Try to fetch user data from Redis cache
      // let userData = await client.get(cacheKey);
      // if (userData) {
      //     userData = JSON.parse(userData);
      //     return res.send({
      //         success: true,
      //         data: userData
      //     });
      // }

      // If not in cache, fetch from database
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send({ success: false, message: "User not found" });
      }

      // Save fetched data to Redis, set expiration as needed
      await client.set(cacheKey, JSON.stringify(user), 'EX', 3600);

      res.send({
          success: true,
          data: user
      });
  } catch (error) {
      res.send({
          success: false,
          message: error.message
      });
  }
});

// get all users
router.get('/get-all-users', authMiddlewares, async (req, res) => {
  try {
      const cacheKey = 'all_users';

      // Try to fetch users data from Redis cache
      let usersData = await client.get(cacheKey);
      if (usersData) {
          usersData = JSON.parse(usersData);
          return res.send({
              success: true,
              data: usersData,
              message: "Users fetched successfully from cache"
          });
      }

      // If not in cache, fetch from database
      const users = await User.find().sort({ createdAt: -1 });
      if (!users.length) {
          return res.status(404).send({ success: false, message: "No users found" });
      }

      // Save fetched data to Redis, set expiration as needed
      // await client.set(cacheKey, JSON.stringify(users), {
      //     EX: 3600 // expires in 1 hour
      // });

      res.send({
          success: true,
          data: users,
          message: "Users fetched successfully"
      });
  } catch (error) {
      res.send({
          success: false,
          message: error.message
      });
  }
});

//update user Status

router.put('/update-user-status/:id', authMiddlewares, async(req,res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success : true,
      message : "user status updated successfully"
    })
  }catch (error) {
    res.send({
      success : false,
      message : error.message
    })
  }
});

//update user role
router.put('/update-user-role/:id', authMiddlewares, async(req,res)=>{
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success : true,
      message : "user role updated successfully"
    })
  }catch (error) {
    res.send({
      success : false,
      message : error.message
    })
  }
});

//update user profile pic
router.post('/update-profile', authMiddlewares, upload.single('file'), async (req, res) => {
  try {
      const file = req.file;

      if (!file) {
          return res.status(400).send({ success: false, message: 'No file uploaded' });
      }
      const fileRef = bucket.file(Date.now().toString() + '-' + file.originalname);

      await fileRef.save(file.buffer, {
          metadata: {
              contentType: file.mimetype
          }
      });

      const profilePic = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileRef.name}?alt=media`;

      const user = await User.findById(req.body.user_id)
     if(user==='null'){
      user=null
     }

      if (user) {
          // Update the product with the uploaded image URL
          
          await User.findByIdAndUpdate(user, {
              $set: { profilepic: profilePic }
          });
      }else{
        console.log("user could not be found" , user)
        console.log("body user", req.body)
      }

      res.send({ success: true, message: 'Profile Image updated successfully!', profilePic });
  } catch (error) {
      console.error(error);
      res.status(500).send('Upload failed');
  }
});


module.exports = router;

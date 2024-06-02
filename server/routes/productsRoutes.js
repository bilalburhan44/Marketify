const router = require("express").Router();
const Product = require("../models/productModels");
const authMiddlewares = require("../middlewares/authMiddlewares");
const multer = require("multer");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { bucket } = require('./firebase');

const client = require('./redisClient');  // Import the Redis client


const upload = multer({
    storage: multer.memoryStorage()
});

// add products
router.post("/add-product", authMiddlewares, upload.single('file'), async (req, res) => {

    try {
        let imageUrl = null;

        if (req.file) {
            const file = req.file;
            const fileRef = bucket.file(Date.now().toString() + '-' + file.originalname);
            await fileRef.save(file.buffer , {
                metadata: {
                    contentType: file.mimetype
                }
            });
            imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${fileRef.name}?alt=media`;
        }
        const newProductData = {
            images: imageUrl ? [imageUrl] : [], // Add the imageUrl to the images array if available
            ...req.body
        };

        const newProduct = new Product(newProductData);
        await newProduct.save();

        // notifications to admin
        const adminUsers = await User.find({ role: "admin" });
        adminUsers.forEach(async (admin) => {
            const notification = new Notification({
                user: admin._id,
                message: `A new product has been added by ${req.user.name}`,
                title: "New product",
                profilepic: req.user.profilepic,
                onClick: "/admin",
                read: false
            });
            await notification.save();
        })

        res.send({
            success: true,
            message: "Product added successfully",
            imageUrl: imageUrl,
            productId: newProduct._id,

        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "failed to add product. Please try again later.",

        });
    }
});
// get all products

router.post("/get-products", async (req, res) => {
    try {
        const { seller, status, category = [], age = [] , searchQuery , sortBy , sortOrder } = req.body;
        let filters = {};
        //filter by category
        if (category.length > 0) {
            filters.category = { $in: category };
        }
        //filter by age
        if (age.length > 0) {
            age.forEach((element) => {
                const fromAge = element.split("-")[0];
                const toAge = element.split("-")[1];
                filters.age = { $gte: fromAge, $lte: toAge };
            });
        }
        if (seller) {
            filters.seller = seller;
        }
        if (status) {
            filters.status = status;
        }
        //search filter
        if (searchQuery) {
            filters.$or = [
                { name: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } }
            ];
        }
   
        const keys = await client.keys("product");
          // Retrieve all product keys
        if (keys) {
            const products = await Promise.all(keys.map(keys.map(key => client.get(key).then(result => {
                return JSON.parse(result);
            }))));
            res.send({ success: true, data: products });
        } else {
        const products = await Product.find(filters).populate("seller").sort({ createdAt: -1 });
        products.forEach(product => {
            client.set(`product:${product._id}`, JSON.stringify(product), 'EX', 3600);  // Make sure this runs
        });
    

        if (sortBy === 'name') {
            products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'price') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'date') {
            products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        // Handle sortOrder (ascending or descending)
        if (sortOrder === 'desc') {
            products.reverse();
        }


       
        res.send({
            success : true,
             data : products,
        })
     }
     } catch (error) {
        res.send({
            success : false,
            message : error.message
        })
     }
 })

 //getting products by id
 router.get("/get-product-by-id/:id", async (req, res) => {
     try {
             // Get product data from Redis
    //  client.get('product:' + req.params.id, async (err, reply) => {
    //         if (err) {
    //             console.error('Error:', err);
    //         } else {
    //             if (reply) {
    //                 const product = JSON.parse(reply);
    //                 res.send({
    //                     success: true,
    //                     data: product
    //                 });
    //             } else {
                    // If data not found in cache, fetch from the database
                    const product = await Product.findById(req.params.id).populate("seller").exec();
                    if (product) {
                        // Cache the fetched product data with expiration time (e.g., 1 hour)
                        //client.set('product:' + req.params.id, JSON.stringify(product), 'EX', 3600);
                        res.send({
                            success: true,
                            data: product
                        });
                    } else {
                        res.status(404).send({
                            success: false,
                            message: "Product not found"
                        });
                    }
                
            
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

 //edit product

 router.put("/edit-product/:id", authMiddlewares, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // Update cache
        // await client.set(`product:${req.params.id}`, JSON.stringify(updatedProduct), {
        //     EX: 3600 // expires in 1 hour
        // });
        res.send({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});
 //delete product

 router.delete("/delete-product/:id", authMiddlewares, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        // Remove from cache
        // await client.del(`product:${req.params.id}`);
        res.send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});



 router.post('/upload-image', authMiddlewares, upload.single('file'), async (req, res) => {
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

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileRef.name}?alt=media`;

      let productId = req.body.productId;
      
      if (productId && productId !== 'null') {
        // Update the product with the uploaded image URL
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            $push: { images: imageUrl }
        }, { new: true });

        // Update cache
        await client.set(`product:${productId}`, JSON.stringify(updatedProduct), {
            EX: 3600 // expires in 1 hour
        });

        res.send({ success: true, message: 'Image uploaded and product updated successfully!', imageUrl });
    } else {
        res.send({ success: true, message: 'Image uploaded successfully!', imageUrl });
    }
  } catch (error) {
      console.error(error);
      res.status(500).send('Upload failed');
  }
});

router.put("/update-product-status/:id", authMiddlewares, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
        // Update cache
        // await client.set(`product:${req.params.id}`, JSON.stringify(updatedProduct), {
        //     EX: 3600 // expires in 1 hour
        // });
        // Send notification to seller
        const newNotification = new Notification({
            user: updatedProduct.seller,
            message: `Your product ${updatedProduct.name} has been ${status}`,
            title: "Product status update",
            onClick: `/profile`,
            read: false
        });
        await newNotification.save();
        res.send({
            success: true,
            message: "Product status updated successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});
  
  module.exports = router;

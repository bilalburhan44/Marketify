const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type : String,
            required : true,
        },
        email:{
            type : String,
            required : true,
            trim : true,
        },
        password:{
            type : String,
            required : true,
        },
        role :{
            type : String,
            default : "user",
        },
        status :{
            type : String,
            default : "active",
        },
        profilepic : {
            type : String,
            default : "",
        },
        googleId: {
            type: String,
            required: false
        },
    },
    {
        timestamps : true,
    }
)

const User = mongoose.model("users",userSchema)

// Add this method to your userModel.js or as a utility function
User.findOrCreate = function findOrCreate(condition, callback) {
    return this.findOne(condition)
        .then(result => {
            if (result) {
                return result;
            } else {
                // Provide default values for required fields if not present
                const userData = {
                    ...condition,
                    name: condition.name || 'Default Name',
                    email: condition.email || 'no-email@example.com',
                    password: condition.password || 'default-password', // Consider security implications
                    profilepic: condition.profilepic
                };
                return this.create(userData);
            }
        })
        .catch(err => {
            throw err;
        });
};

module.exports = User
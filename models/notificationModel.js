const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    },
    message : {
        type : String,
        required : true,
    },
    read : {
        type : Boolean,
        default : false,
    },
    title :{
        type : String,
        required : true,
    },
    onClick :{
        type : String,
        required : true,
    },
    profilepic : {
        type : String,
        default : "",
    }
}, {timestamps : true});

module.exports = mongoose.model("notifications" , notificationSchema)
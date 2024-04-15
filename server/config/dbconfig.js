const  mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("connected" , ()=>{
    console.log("mongodb connected succesfully");
})

connection.on("error",(err)=>{
    console.log("failed connection");
})

module.exports = connection;
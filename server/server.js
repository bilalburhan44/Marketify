const express = require('express');
const app = express();
app.use(express.json())
require('dotenv').config();
const dbconfig = require('./config/dbconfig');
const port = process.env.port || 5000;

const usersRoutes = require('./routes/usersRoute');
const productsRoutes = require('./routes/productsRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/users',usersRoutes)
app.use('/api/products',productsRoutes)
app.use('/api/bids',bidRoutes)
app.use('/api/notifications',notificationRoutes)

//deployment config
const path = require("path")
_dirname = path.resolve();
//render deployment 
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"/client/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(_dirname,"client","build","index.html"))
    })
}

app.listen(port,()=>{console.log(`Node/express started listening on port ${port}`)})
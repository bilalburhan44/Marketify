const router = require("express").Router();
const authMiddlewares = require("../middlewares/authMiddlewares");
const Bid = require("../models/bidModel");

router.post("/create-bid", authMiddlewares, async (req, res) => {
    try {
        const newBid = new Bid(req.body);
        await newBid.save();
        res.send({
            success: true,
            message: "Bid Added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

router.get("/get-bids", authMiddlewares, async (req, res) => {
    try {
        const {product , seller , buyer} = req.query;
        let filters = {};
        if(product){
            filters.product = product;
        }
     
        const bids = await Bid.find(filters).populate("product").populate("seller").populate("buyer").sort({createdAt: -1});
        res.send({
            success: true,
            data: bids,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

// delete bid
router.delete("/delete-bid/:id", authMiddlewares, async (req, res) => {
    try {
        await Bid.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Bid deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

module.exports = router
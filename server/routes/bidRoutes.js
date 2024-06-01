const router = require("express").Router();
const authMiddlewares = require("../middlewares/authMiddlewares");
const Bid = require("../models/bidModel");
const client = require('./redisClient'); 

router.post("/create-bid", authMiddlewares, async (req, res) => {
    try {
        const newBid = new Bid(req.body);
        await newBid.save();
        // Invalidate cache
        await client.del(`bids:*`); // This assumes you want to invalidate all bid caches; adjust as necessary
        res.send({
            success: true,
            message: "Bid added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

router.get("/get-bids", authMiddlewares, async (req, res) => {
    try {
        const { product, seller, buyer } = req.query;
        let filters = JSON.stringify({ product, seller, buyer }); // Create a unique key for caching
        const cacheKey = `bids:${filters}`;

        // Try to fetch bid data from Redis cache
        let cachedBids = await client.get(`bids:${filters}`);
        if (cachedBids) {
            cachedBids = JSON.parse(cachedBids)
            return res.send({
                success: true,
                data: cachedBids,
            });
        }

        // If not in cache, fetch from database
        let dbFilters = {};
        if (product) dbFilters.product = product;
        if (seller) dbFilters.seller = seller;
        

        const bids = await Bid.find(dbFilters).populate("product").populate("seller").populate("buyer").sort({ createdAt: -1 });
        // Save fetched data to Redis, set expiration as needed
        await client.set(cacheKey, JSON.stringify(bids), 'EX', 3600);

        res.send({
            success: true,
            data: bids
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// delete bid
router.delete("/delete-bid/:id", authMiddlewares, async (req, res) => {
    try {
        await Bid.findByIdAndDelete(req.params.id);
        // Invalidate cache
        await client.del(`bids:*`); // This assumes you want to invalidate all bid caches; adjust as necessary
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
});

module.exports = router
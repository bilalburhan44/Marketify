const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const Notification = require('../models/notificationModel');

//add notification
router.post('/add-notification', authMiddleware, async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.send({
            success: true,
            message: 'Notification added successfully',
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

//get notifications
router.get('/get-notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.body.userId }).sort({ createdAt: -1 });
        res.send({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

//delete notification
router.delete('/delete-notification/:id', authMiddleware, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})

//read notification

router.put('/read-all-notifications', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany(
           { user : req.body.userId , read: false }
           , { $set: { read: true } });
        res.send({
            success: true,
            message: 'Notification marked as read successfully',
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})


module.exports = router
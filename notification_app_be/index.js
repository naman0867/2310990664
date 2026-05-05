import express from "express";
import logger from "../logging_middleware/logger.js";

const app = express();


app.use(express.json());
app.use(logger);


let notifications = [];


app.post("/notify", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required"
        });
    }

    const newNotification = {
        id: Date.now(),
        message,
        read: false
    };

    notifications.push(newNotification);

    res.status(201).json({
        success: true,
        data: newNotification
    });
});

app.get("/notifications", (req, res) => {
    res.status(200).json({
        success: true,
        data: notifications
    });
});

app.put("/read/:id", (req, res) => {
    const id = parseInt(req.params.id);

    let found = false;

    notifications = notifications.map(n => {
        if (n.id === id) {
            found = true;
            return { ...n, read: true };
        }
        return n;
    });

    if (!found) {
        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Marked as read"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
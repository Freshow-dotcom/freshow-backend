
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let orders = [];

// Home
app.get("/", (req, res) => {
    res.send("Freshow Backend Running");
});

// Create Order
app.post("/create-order", (req, res) => {

    const order = {
        id: Date.now(),
        item: req.body.item,
        amount: req.body.amount,
        status: "PENDING"
    };

    orders.push(order);

    res.json(order);
});

// Get All Orders
app.get("/orders", (req, res) => {
    res.json(orders);
});

// Approve Order
app.post("/approve/:id", (req, res) => {

    const id = Number(req.params.id);

    const order = orders.find(o => o.id === id);

    if (!order) {
        return res.status(404).json({
            error: "Order Not Found"
        });
    }

    if (order.status !== "PENDING") {
        return res.status(400).json({
            error: "Order is not pending"
        });
    }

    order.status = "PAID";

    res.json(order);
});

// ESP32 claims the next approved order
app.post("/claim-next-order", (req, res) => {

    const order = orders.find(
        o => o.status === "PAID"
    );

    if (!order) {
        return res.json({
            order: null,
            message: "No approved orders"
        });
    }

    order.status = "DISPENSING";

    res.json({
        order: order
    });
});

// ESP32 reports completed dispensing
app.post("/complete-order/:id", (req, res) => {

    const id = Number(req.params.id);

    const order = orders.find(o => o.id === id);

    if (!order) {
        return res.status(404).json({
            error: "Order Not Found"
        });
    }

    if (order.status !== "DISPENSING") {
        return res.status(400).json({
            error: "Order is not being dispensed"
        });
    }

    order.status = "COMPLETED";

    res.json({
        success: true,
        order: order
    });
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Freshow Backend Running");
});


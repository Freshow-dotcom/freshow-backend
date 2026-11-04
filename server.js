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

    const order = orders.find(
        o => o.id === id
    );

    if (!order) {

        return res.status(404).json({
            error: "Order Not Found"
        });

    }

    order.status = "PAID";

    res.json(order);

});

// ESP32 Check
app.get("/latest-paid-order", (req, res) => {

    const paidOrders = orders.filter(
        o => o.status === "PAID"
    );

    if (paidOrders.length === 0) {

        return res.json({
            item: null
        });

    }

    res.json(
        paidOrders[paidOrders.length - 1]
    );

});

app.listen(process.env.PORT || 10000, () => {

    console.log(
        "Freshow Backend Running"
    );

});

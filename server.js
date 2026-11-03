const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Freshow Backend Running");
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Server Started");
});

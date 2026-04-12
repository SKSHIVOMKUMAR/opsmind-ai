const env = require("dotenv").config()
const express = require("express");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");

app.get("/", (req, res)=>{
    res.send("This Home Page")
})

app.use("/api", uploadRoutes);

module.exports = app;
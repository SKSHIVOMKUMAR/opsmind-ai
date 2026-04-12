const mongoose = require("mongoose");

async function connetDB(){
    try {
        mongoose.connect("mongodb://localhost:27017/opsmind-Ai").
        console.log("Database is Connected")
    } catch (error) {
        console.log("Error", error);
    }
}

module.exports = connetDB;
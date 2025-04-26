const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully");

    } catch (error) {

        console.log("Failed to connect Database", console.error())
    }
}

module.exports = connectDatabase;
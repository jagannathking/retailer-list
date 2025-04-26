const express = require('express');
const cors = require('cors');

const connectDatabase = require('./config/db');
const retailerRoutes = require('./routes/retailerRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/errorHandler');

const app = express();

// connect database
connectDatabase(); 

// Middlewares
app.use(cors()); 
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 

// Health check route 
app.get('/', (req, res) => { 
    res.status(200).json({
        success: true,
        message: "Server is Healthy"
    });
});

// Mount Routers - Handles routes starting with /retailers
app.use('/retailers', retailerRoutes); 

// Handle undefined routes 
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware 
app.use(globalErrorHandler);

module.exports = app; 
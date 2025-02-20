require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { orderService } = require('./services/orderService');
const { getAllMenuItems, getAllIngredients } = require('./data/menuData');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Helper function for error handling
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Response wrapper for consistent API responses
const createResponse = (data, error = null) => ({
    success: !error,
    data: error ? null : data,
    error: error ? error.message : null
});

// Basic health check endpoint
app.get('/health', (_, res) => {
    res.json(createResponse({ status: 'ok' }));
});

// Get menu items
app.get('/menu', asyncHandler(async (_, res) => {
    const menuItems = await getAllMenuItems();
    res.json(createResponse(menuItems));
}));

// Get ingredients
app.get('/ingredients', asyncHandler(async (_, res) => {
    const ingredients = await getAllIngredients();
    res.json(createResponse(ingredients));
}));

// Create new order
app.post('/orders', asyncHandler(async (_, res) => {
    const orderId = await orderService.createOrder();
    res.status(201).json(createResponse({ orderId }));
}));

// Get order details
app.get('/orders/:orderId', asyncHandler(async (req, res) => {
    const order = await orderService.getOrder(Number(req.params.orderId));
    res.json(createResponse(order));
}));

// Add item to order
app.post('/orders/:orderId/items', asyncHandler(async (req, res) => {
    const { menuItemId, customizations } = req.body;
    
    // Validate required fields
    if (!menuItemId) {
        throw new Error('menuItemId is required');
    }
    
    // Get current order status
    const currentOrder = await orderService.getOrder(Number(req.params.orderId));
    if (currentOrder.status === 'completed') {
        throw new Error('Cannot modify a completed order');
    }

    const order = await orderService.addItemToOrder(
        Number(req.params.orderId),
        menuItemId,
        customizations || []
    );
    res.json(createResponse(order));
}));

// Complete order
app.post('/orders/:orderId/complete', asyncHandler(async (req, res) => {
    // Get current order status
    const currentOrder = await orderService.getOrder(Number(req.params.orderId));
    if (currentOrder.status === 'completed') {
        throw new Error('Order is already completed');
    }
    
    const order = await orderService.completeOrder(Number(req.params.orderId));
    res.json(createResponse(order));
}));

// Error handling middleware
app.use((err, _, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(400).json(createResponse(null, err));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 
const db = require('../config/database');
const { getMenuItem, checkIngredientsAvailability, updateIngredientStock } = require('../data/menuData');

// Create a new order
const createNewOrder = async () => {
    const result = await db.query(
        'INSERT INTO orders (status, total_price) VALUES ($1, $2) RETURNING *',
        ['pending', 0]
    );
    return result.rows[0];
};

// Get order by ID
const getOrder = async (orderId) => {
    const order = await db.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
    );
    
    if (!order.rows[0]) {
        throw new Error('Order not found');
    }

    const items = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId]
    );

    return {
        ...order.rows[0],
        items: items.rows
    };
};

// Create an order item
const createOrderItem = async (menuItemId, customizations = []) => {
    const menuItem = await getMenuItem(menuItemId);
    if (!menuItem) {
        throw new Error('Menu item not found');
    }

    return {
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        customizations
    };
};

// Add item to order
const addItemToOrder = async (orderId, menuItemId, customizations = []) => {
    const menuItem = await getMenuItem(menuItemId);
    if (!menuItem) {
        throw new Error('Menu item not found');
    }

    // Verify ingredients availability
    const hasIngredients = await checkIngredientsAvailability(menuItem.required_ingredients);
    if (!hasIngredients) {
        throw new Error('Insufficient ingredients available');
    }

    // Start a transaction
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Create order item
        const orderItem = await createOrderItem(menuItemId, customizations);
        const insertedItem = await client.query(
            'INSERT INTO order_items (order_id, menu_item_id, name, price, customizations) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, menuItemId, orderItem.name, orderItem.price, JSON.stringify(customizations)]
        );

        // Update ingredients stock
        for (const [ingredientId, quantity] of Object.entries(menuItem.required_ingredients)) {
            await updateIngredientStock(ingredientId, -quantity);
        }

        // Update order total
        const updatedOrder = await client.query(
            'UPDATE orders SET total_price = total_price + $1 WHERE id = $2 RETURNING *',
            [orderItem.price, orderId]
        );

        await client.query('COMMIT');
        return getOrder(orderId);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// Complete order
const completeOrder = async (orderId) => {
    const result = await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        ['completed', orderId]
    );

    if (!result.rows[0]) {
        throw new Error('Order not found');
    }

    return getOrder(orderId);
};

// Get all orders
const getAllOrders = async () => {
    const orders = await db.query('SELECT * FROM orders');
    const orderItems = await db.query('SELECT * FROM order_items');
    
    return orders.rows.map(order => ({
        ...order,
        items: orderItems.rows.filter(item => item.order_id === order.id)
    }));
};

const orderService = {
    createOrder: async () => {
        const order = await createNewOrder();
        return order.id;
    },
    getOrder,
    addItemToOrder,
    completeOrder,
    getAllOrders
};

module.exports = {
    orderService,
    // Export functions for testing
    createNewOrder,
    createOrderItem,
    addItemToOrder,
    completeOrder,
    getAllOrders
}; 
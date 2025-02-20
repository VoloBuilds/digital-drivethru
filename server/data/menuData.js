const db = require('../config/database');

// Get ingredient by ID
const getIngredient = async (id) => {
    const result = await db.query(
        'SELECT * FROM ingredients WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

// Get menu item by ID
const getMenuItem = async (id) => {
    const menuItem = await db.query(
        `SELECT m.*, json_object_agg(mi.ingredient_id, mi.quantity) as required_ingredients
         FROM menu_items m
         LEFT JOIN menu_item_ingredients mi ON m.id = mi.menu_item_id
         WHERE m.id = $1
         GROUP BY m.id`,
        [id]
    );
    return menuItem.rows[0];
};

// Get all menu items with their required ingredients
const getAllMenuItems = async () => {
    const result = await db.query(
        `SELECT m.*, json_object_agg(mi.ingredient_id, mi.quantity) as required_ingredients
         FROM menu_items m
         LEFT JOIN menu_item_ingredients mi ON m.id = mi.menu_item_id
         GROUP BY m.id`
    );
    return result.rows;
};

// Get all ingredients
const getAllIngredients = async () => {
    const result = await db.query('SELECT * FROM ingredients');
    return result.rows;
};

// Update ingredient stock
const updateIngredientStock = async (id, quantity) => {
    const result = await db.query(
        'UPDATE ingredients SET in_stock = in_stock + $1 WHERE id = $2 RETURNING *',
        [quantity, id]
    );
    return result.rows[0];
};

// Check if ingredients are available
const checkIngredientsAvailability = async (requiredIngredients) => {
    const ingredients = await Promise.all(
        Object.entries(requiredIngredients).map(async ([id, quantity]) => {
            const result = await db.query(
                'SELECT * FROM ingredients WHERE id = $1 AND in_stock >= $2',
                [id, quantity]
            );
            return result.rows[0];
        })
    );
    return ingredients.every(ingredient => ingredient !== undefined);
};

module.exports = {
    getIngredient,
    getMenuItem,
    getAllMenuItems,
    getAllIngredients,
    updateIngredientStock,
    checkIngredientsAvailability
}; 
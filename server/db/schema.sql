-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    in_stock INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Create menu_item_ingredients table for required ingredients
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    menu_item_id VARCHAR(50) REFERENCES menu_items(id),
    ingredient_id VARCHAR(50) REFERENCES ingredients(id),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (menu_item_id, ingredient_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    menu_item_id VARCHAR(50) REFERENCES menu_items(id),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    customizations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 
-- Clear existing data (optional, remove these lines if you want to keep existing data)
TRUNCATE order_items CASCADE;
TRUNCATE orders CASCADE;
TRUNCATE menu_item_ingredients CASCADE;
TRUNCATE menu_items CASCADE;
TRUNCATE ingredients CASCADE;

-- Insert ingredients
INSERT INTO ingredients (id, name, in_stock, unit) VALUES
    ('bun', 'Burger Bun', 200, 'piece'),
    ('beef-patty', 'Beef Patty', 150, 'piece'),
    ('chicken-patty', 'Chicken Patty', 100, 'piece'),
    ('veggie-patty', 'Veggie Patty', 50, 'piece'),
    ('lettuce', 'Lettuce', 300, 'piece'),
    ('tomato', 'Tomato', 250, 'slice'),
    ('cheese', 'Cheese', 400, 'slice'),
    ('bacon', 'Bacon', 200, 'piece'),
    ('onion', 'Onion', 150, 'slice'),
    ('pickle', 'Pickle', 300, 'slice'),
    ('mayo', 'Mayonnaise', 500, 'portion'),
    ('mustard', 'Mustard', 500, 'portion'),
    ('ketchup', 'Ketchup', 500, 'portion'),
    ('bbq-sauce', 'BBQ Sauce', 300, 'portion'),
    ('jalapeno', 'Jalapeño', 200, 'piece');

-- Insert menu items
INSERT INTO menu_items (id, name, price) VALUES
    ('classic-burger', 'Classic Burger', 8.99),
    ('cheeseburger', 'Cheeseburger', 9.99),
    ('bacon-cheeseburger', 'Bacon Cheeseburger', 11.99),
    ('double-burger', 'Double Burger', 12.99),
    ('chicken-sandwich', 'Chicken Sandwich', 9.99),
    ('veggie-burger', 'Veggie Burger', 10.99),
    ('spicy-chicken', 'Spicy Chicken Sandwich', 10.99),
    ('bbq-bacon-burger', 'BBQ Bacon Burger', 12.99),
    ('mushroom-swiss', 'Mushroom Swiss Burger', 11.99),
    ('western-burger', 'Western Burger', 12.99);

-- Insert menu item ingredients
INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, quantity) VALUES
    -- Classic Burger
    ('classic-burger', 'bun', 1),
    ('classic-burger', 'beef-patty', 1),
    ('classic-burger', 'lettuce', 1),
    ('classic-burger', 'tomato', 2),
    ('classic-burger', 'onion', 2),
    ('classic-burger', 'pickle', 2),
    
    -- Cheeseburger
    ('cheeseburger', 'bun', 1),
    ('cheeseburger', 'beef-patty', 1),
    ('cheeseburger', 'cheese', 1),
    ('cheeseburger', 'lettuce', 1),
    ('cheeseburger', 'tomato', 2),
    ('cheeseburger', 'onion', 2),
    
    -- Bacon Cheeseburger
    ('bacon-cheeseburger', 'bun', 1),
    ('bacon-cheeseburger', 'beef-patty', 1),
    ('bacon-cheeseburger', 'cheese', 1),
    ('bacon-cheeseburger', 'bacon', 2),
    ('bacon-cheeseburger', 'lettuce', 1),
    ('bacon-cheeseburger', 'tomato', 2),
    
    -- Double Burger
    ('double-burger', 'bun', 1),
    ('double-burger', 'beef-patty', 2),
    ('double-burger', 'cheese', 2),
    ('double-burger', 'lettuce', 1),
    ('double-burger', 'tomato', 2),
    ('double-burger', 'onion', 2),
    
    -- Chicken Sandwich
    ('chicken-sandwich', 'bun', 1),
    ('chicken-sandwich', 'chicken-patty', 1),
    ('chicken-sandwich', 'lettuce', 1),
    ('chicken-sandwich', 'tomato', 2),
    ('chicken-sandwich', 'mayo', 1),
    
    -- Veggie Burger
    ('veggie-burger', 'bun', 1),
    ('veggie-burger', 'veggie-patty', 1),
    ('veggie-burger', 'lettuce', 1),
    ('veggie-burger', 'tomato', 2),
    ('veggie-burger', 'onion', 2),
    
    -- Spicy Chicken
    ('spicy-chicken', 'bun', 1),
    ('spicy-chicken', 'chicken-patty', 1),
    ('spicy-chicken', 'lettuce', 1),
    ('spicy-chicken', 'jalapeno', 3),
    ('spicy-chicken', 'mayo', 1),
    
    -- BBQ Bacon Burger
    ('bbq-bacon-burger', 'bun', 1),
    ('bbq-bacon-burger', 'beef-patty', 1),
    ('bbq-bacon-burger', 'cheese', 1),
    ('bbq-bacon-burger', 'bacon', 2),
    ('bbq-bacon-burger', 'onion', 2),
    ('bbq-bacon-burger', 'bbq-sauce', 1),
    
    -- Mushroom Swiss
    ('mushroom-swiss', 'bun', 1),
    ('mushroom-swiss', 'beef-patty', 1),
    ('mushroom-swiss', 'cheese', 2),
    ('mushroom-swiss', 'lettuce', 1),
    ('mushroom-swiss', 'mayo', 1),
    
    -- Western Burger
    ('western-burger', 'bun', 1),
    ('western-burger', 'beef-patty', 1),
    ('western-burger', 'cheese', 1),
    ('western-burger', 'bacon', 2),
    ('western-burger', 'onion', 3),
    ('western-burger', 'bbq-sauce', 1);

-- Insert sample orders (optional)
INSERT INTO orders (status, total_price) VALUES
    ('completed', 21.98),
    ('completed', 32.97),
    ('pending', 11.99);

-- Insert sample order items (optional)
INSERT INTO order_items (order_id, menu_item_id, name, price, customizations) VALUES
    (1, 'classic-burger', 'Classic Burger', 8.99, '["no onions"]'),
    (1, 'cheeseburger', 'Cheeseburger', 12.99, '["extra cheese"]'),
    (2, 'bacon-cheeseburger', 'Bacon Cheeseburger', 11.99, '[]'),
    (2, 'spicy-chicken', 'Spicy Chicken Sandwich', 10.99, '["extra jalapenos"]'),
    (2, 'veggie-burger', 'Veggie Burger', 9.99, '["no tomato"]'),
    (3, 'bbq-bacon-burger', 'BBQ Bacon Burger', 11.99, '["extra bbq sauce"]'); 
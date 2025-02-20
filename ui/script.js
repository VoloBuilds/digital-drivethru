// Store the current order details
let currentOrder = {
    orderId: null,
    items: []
};

// API base URL
const API_BASE_URL = 'http://localhost:3000';

// Helper function to show loading state
function showLoading(element, message = 'Loading') {
    element.innerHTML = `<div class="loading">${message}</div>`;
}

// Helper function to show error message
function showError(element, message) {
    element.innerHTML = `<div class="error-message">${message}</div>`;
}

// Helper function to check if server is available
async function checkServerConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Server connection error:', error);
        return false;
    }
}

// Function to fetch menu items from the API
async function loadMenu() {
    const menuBoard = document.querySelector('.menu-board');
    showLoading(menuBoard);

    try {
        if (!await checkServerConnection()) {
            throw new Error('Unable to connect to server. Please make sure the server is running.');
        }

        const response = await fetch(`${API_BASE_URL}/menu`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load menu');
        }

        displayMenu(data.data);
    } catch (error) {
        console.error('Error loading menu:', error);
        showError(menuBoard, error.message || 'Failed to load menu items. Please try again later.');
    }
}

// Function to display menu items
function displayMenu(menuItems) {
    const menuBoard = document.querySelector('.menu-board');
    menuBoard.innerHTML = '<h2>Our Menu</h2>';

    // Group menu items by category
    const categories = {};
    menuItems.forEach(item => {
        // Use a default category if none is provided
        const category = item.category || 'Items';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(item);
    });

    // Create sections for each category
    for (const [category, items] of Object.entries(categories)) {
        const section = document.createElement('div');
        section.className = 'menu-section';
        section.innerHTML = `<h3>${category}</h3>`;

        items.forEach(item => {
            // Convert price to number and handle invalid values
            const price = parseFloat(item.price) || 0;
            
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div class="item-info">
                    <i class="fas fa-utensils"></i>
                    <span class="item-name">${item.name}</span>
                    <div class="item-customizations">${item.description || ''}</div>
                </div>
                <div class="item-actions">
                    <span class="price">$${price.toFixed(2)}</span>
                    <button onclick="addToOrder('${item.id}')" id="add-item-${item.id}">Add to Order</button>
                </div>
            `;
            section.appendChild(menuItem);
        });

        menuBoard.appendChild(section);
    }
}

// Function to create a new order
async function createOrder() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to create order');
        }

        currentOrder.orderId = data.data.orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        const menuBoard = document.querySelector('.menu-board');
        showError(menuBoard, 'Failed to create order. Please refresh the page to try again.');
    }
}

// Function to add items to the order
async function addToOrder(menuItemId) {
    if (!currentOrder.orderId) {
        alert('Unable to add item. Please try refreshing the page.');
        return;
    }

    // Clean the menuItemId to handle string IDs
    const cleanMenuItemId = menuItemId.toString();

    // Disable the add button while processing
    const addButton = document.getElementById(`add-item-${cleanMenuItemId}`);
    const originalText = addButton.textContent;
    addButton.disabled = true;
    addButton.textContent = 'Adding...';

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.orderId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                menuItemId: cleanMenuItemId
            })
        });
        const data = await response.json();
        
        if (!data.success) {
            // Show specific error for ingredient availability
            if (data.error && data.error.includes('ingredients')) {
                throw new Error('Sorry, we don\'t have enough ingredients to make this item right now.');
            }
            throw new Error(data.error || 'Failed to add item to order');
        }

        // Update the current order with the latest data
        await updateOrderDisplay();
    } catch (error) {
        console.error('Error adding item to order:', error);
        // Show error message in a more user-friendly way
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translateX(-50%)';
        errorMessage.style.zIndex = '1000';
        errorMessage.style.padding = '15px 30px';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        errorMessage.textContent = error.message;
        
        document.body.appendChild(errorMessage);
        
        // Remove the error message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    } finally {
        // Re-enable the add button
        addButton.disabled = false;
        addButton.textContent = originalText;
    }
}

// Function to update the order display
async function updateOrderDisplay() {
    const orderItems = document.getElementById('order-items');
    showLoading(orderItems, 'Updating order');

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.orderId}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch order details');
        }

        const order = data.data;
        
        // Clear current display
        orderItems.innerHTML = '';
        
        if (!order.items || order.items.length === 0) {
            orderItems.innerHTML = '<div class="order-item">No items in order</div>';
            
            // Reset total when no items
            const totalAmount = document.getElementById('total-amount');
            totalAmount.textContent = '$0.00';
            
            // Disable purchase button
            const purchaseBtn = document.getElementById('purchase-btn');
            purchaseBtn.disabled = true;
            return;
        }
        
        let subtotal = 0;
        
        // Group items by name to show quantities
        const groupedItems = order.items.reduce((acc, item) => {
            const key = item.name;
            if (!acc[key]) {
                acc[key] = {
                    name: item.name,
                    price: parseFloat(item.price) || 0,
                    quantity: 1,
                    customizations: item.customizations,
                    totalPrice: parseFloat(item.price) || 0
                };
            } else {
                acc[key].quantity += 1;
                acc[key].totalPrice += parseFloat(item.price) || 0;
            }
            return acc;
        }, {});
        
        // Add each grouped item to the display
        Object.values(groupedItems).forEach(item => {
            subtotal += item.totalPrice;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="item-name-quantity">
                        ${item.quantity > 1 ? `<span class="quantity">x${item.quantity}</span>` : ''}
                        <span>${item.name}</span>
                    </div>
                    ${item.customizations && item.customizations.length > 0 
                        ? `<div class="item-customizations">${item.customizations.join(', ')}</div>` 
                        : ''}
                </div>
                <div class="item-actions">
                    <span>$${item.totalPrice.toFixed(2)}</span>
                </div>
            `;
            orderItems.appendChild(orderItem);
        });
        
        // Calculate and display the total
        const totalAmount = document.getElementById('total-amount');
        const total = order.total || subtotal; // Use order.total if available, otherwise use calculated subtotal
        totalAmount.textContent = `$${parseFloat(total).toFixed(2)}`;

        // Enable purchase button
        const purchaseBtn = document.getElementById('purchase-btn');
        purchaseBtn.disabled = false;
    } catch (error) {
        console.error('Error updating order display:', error);
        showError(orderItems, 'Failed to update order display');
    }
}

// Function to complete the purchase
async function completePurchase() {
    if (!currentOrder.orderId) {
        alert('No active order to complete.');
        return;
    }

    const purchaseBtn = document.getElementById('purchase-btn');
    purchaseBtn.disabled = true;
    purchaseBtn.textContent = 'Processing...';

    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.orderId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to complete order');
        }

        alert('Thank you for your order! Your order will be ready soon!');
        
        // Create a new order for the next customer
        await createOrder();
        await updateOrderDisplay();
    } catch (error) {
        console.error('Error completing order:', error);
        alert('Failed to complete order. Please try again.');
    } finally {
        purchaseBtn.disabled = false;
        purchaseBtn.textContent = 'Complete Purchase';
    }
}

// Initialize the page
async function initialize() {
    const menuBoard = document.querySelector('.menu-board');
    const orderItems = document.getElementById('order-items');

    showLoading(menuBoard, 'Loading menu');
    showLoading(orderItems, 'Initializing order');

    try {
        if (!await checkServerConnection()) {
            throw new Error('Unable to connect to server. Please make sure the server is running on http://localhost:3000');
        }

        await createOrder();
        await loadMenu();
        await updateOrderDisplay();
    } catch (error) {
        console.error('Error initializing application:', error);
        showError(menuBoard, error.message || 'Failed to initialize application. Please refresh the page.');
        showError(orderItems, 'Order system unavailable');
    }
}

// Start the application when the page loads
window.addEventListener('load', initialize); 
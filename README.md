# Digital Drive-Thru

This digital drive-thru is meant to demonstrate modern web development concepts by drawing parallels between a digital ordering system and a traditional drive-thru restaurant. This project is part of the AI Coding 101 series, designed to take viewers from having no coding experience to building full-stack applications with the help of AI.

You can watch the full video here:

[![AI Coding 101: How Full Stack Apps Actually Work](https://img.youtube.com/vi/XB4UcDOWbXs/0.jpg)](https://youtu.be/XB4UcDOWbXs)
> 🎥 AI Coding 101: How Full Stack Apps Actually Work

## Project Overview

This application simulates a digital drive-thru experience, where each component represents a real-world counterpart:

- **Menu Board (Frontend)**: The user interface (`index.html` + `script.js`)
  - Just like a physical menu board, it displays available items and prices
  - Allows customers to select items and customize their order
  - Shows real-time order updates and total cost

- **Order Window (API)**: The communication layer (`server.js`)
  - Similar to a drive-thru speaker/window where orders are taken
  - Handles requests between the customer (frontend) and kitchen (backend)
  - Manages order creation, modification, and completion

- **Kitchen (Backend server)**: The business logic layer (`orderService.js` + `menuData.js`)
  - Processes orders and manages the cooking process
  - Handles inventory and ingredient management
  - Ensures order accuracy and completion

- **Pantry (Database)**: The data storage layer (PostgreSQL + `database.js`)
  - Stores menu items, ingredients, and order information
  - Tracks inventory levels
  - Maintains order history

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **API**: Express js
- **Database**: PostgreSQL

## System Requirements

Before running the application, ensure you have the following installed:

1. **Node.js**: Version 14.x or higher
   - Download from [nodejs.org](https://nodejs.org/)
   - Required for running the server and managing dependencies

2. **PostgreSQL**: Version 12.x or higher
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Required for the database
   - Default configuration:
     - User: postgres
     - Password: postgres
     - Database: drivethru
     - Port: 5432

## Key Features

- Real-time menu display
- Order creation and modification
- Item customization
- Order status tracking
- Inventory management
- Error handling and validation

## Educational Purpose

This project is designed as part of the AI Coding 101 series to help beginners understand:
- How different parts of a web application work together
- Real-world analogies to technical concepts
- Modern web development practices
- Full-stack application architecture

## Getting Started

1. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb drivethru
   ```
   (or download pgAdmin and do it manually as in the video)

2. Configure environment variables:
   Create a `.env` file in the server directory with:
   ```
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=drivethru
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3000
   ```

3. Start the backend server:
   ```bash
   cd server
   npm install
   npm start
   ```
   Note: also consider using nodemon instead of running directly via 'node' so the server restarts when you make file changes.

4. Open the frontend:
   ```bash
   cd ui
   # Open index.html in your browser
   ```

The application will be available at http://localhost:3000 for the API and you can access the UI by opening the index.html file directly in your browser.

## Contributing
This is a proof of concept and is not intended for production use. This repository is for educational purposes and will not be maintained. Please feel free to fork and maintain your own version!

## License
MIT License - feel free to use this code for your own projects!

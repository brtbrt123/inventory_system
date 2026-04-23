# Cabuyao Tech Inventory Management System

A web-based inventory management application developed by **Group 8** for the Bachelor of Science in Computer Science program at **Pamantasan ng Cabuyao (PnC)**.

## 📌 Project Overview
This system provides a professional interface for managing product stock, tracking suppliers, and handling user authentication (Login/Signup). It demonstrates full-stack development integration using HTML, CSS, JavaScript, PHP, and MySQL.

## 📂 Project Structure
The project is organized for better maintainability and professional standards:
* **`/css`**: Contains `style.css` for all visual layouts.
* **`/js`**: Contains `script.js` for frontend logic and API communication.
* **`/php`**: Contains all backend logic, including `db_connect.php`, `signup.php`, and `get_products.php`.
* **`/img`**: Storage for assets like the admin profile photo (`profile_C.jpg`).
* **`inventory_system_db.sql`**: The database schema export to recreate the `users`, `products`, and `purchase_orders` tables.
* **`index.html`**: The main entry point of the application.

## 🚀 Key Features
* **User Authentication**: Secure Login and Signup functionality.
* **Real-time Dashboard**: Overview of total products, total value, and stock alerts.
* **Inventory Management**: Full CRUD functionality for products.
* **Database Integration**: Fully connected to a MySQL backend via PHP.

## 🛠️ Tech Stack
* **Frontend**: HTML5, CSS3, JavaScript
* **Backend**: PHP
* **Database**: MySQL
* **Environment**: XAMPP (Apache)

## 🔧 Setup Instructions
1.  Place the folder in your XAMPP `htdocs` directory.
2.  Open phpMyAdmin and create a database named `cabuyao_inventory_grp8`.
3.  Import the `inventory_system_db.sql` file into your new database.
4.  Update `php/db_connect.php` with your local database credentials.
5.  Access the system at `http://localhost/inventory_system/`.

## 👥 Group 8 Members
* **Bril Abarquiz** (Lead Developer)

---
*Developed for academic purposes at Pamantasan ng Cabuyao.*

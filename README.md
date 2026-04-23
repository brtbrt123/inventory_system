# Cabuyao Tech Inventory Management System

A web-based inventory management application developed by **Group 8** for the Bachelor of Science in Computer Science program at **Pamantasan ng Cabuyao (PnC)**.

## 📌 Project Overview
This system provides a professional interface for managing product stock, tracking suppliers, and handling user authentication (Login/Signup). It is designed to demonstrate full-stack development integration using HTML, CSS, JavaScript, PHP, and MySQL.

## 🚀 Features
* **User Authentication**: Secure Login and Account Creation (Signup) for inventory managers.
* **Real-time Dashboard**: Overview of total products, total inventory value, and low stock alerts.
* **Inventory Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
* **Search & Filter**: Real-time search by product name or supplier and filtering by category.
* **Reports**: Automated categorization and distribution reports.
* **Responsive UI**: Modern, clean sidebar-based navigation.

## 📂 Project Structure
The project follows an organized architectural pattern:
* `/css`: Contains `style.css` for all visual layouts.
* `/js`: Contains `script.js` for frontend logic and API communication.
* `/php`: Contains backend logic (e.g., `db_connect.php`, `get_products.php`, `signup.php`).
* `/img`: Storage for profile pictures and assets.
* `index.html`: The main entry point of the application.

## 🛠️ Tech Stack
* **Frontend**: HTML5, CSS3, JavaScript (ES6)
* **Backend**: PHP
* **Database**: MySQL
* **Server Environment**: XAMPP (Apache)

## 🔧 Setup Instructions
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/brtbrt123/inventory_system.git
    ```
2.  **Move to htdocs**: Place the folder inside your XAMPP `htdocs` directory.
3.  **Database Setup**:
    * Open phpMyAdmin and create a database (e.g., `inventory_db`).
    * Run the provided SQL scripts to create `users` and `products` tables.
4.  **Configure Connection**: Update `php/db_connect.php` with your local database credentials.
5.  **Access the System**: Navigate to `http://localhost/inventory_system/` in your browser.

## 👥 Group 8 Members
* Bril Abarquiz (Lead Developer)

---
*Developed for academic purposes at Pamantasan ng Cabuyao.*

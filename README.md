To provide a professional README for your semester project, I have drafted a version that highlights the technical complexity of your work—specifically focusing on the **Relational Database Design**, **Normalization**, and the **Visual Inventory** features we implemented.

### README.md

# Cabuyao Tech Inventory Management System
**CS Project - Semester 2 | Group 8**

## 🚀 Project Overview
A robust, full-stack Inventory Management System designed to handle real-time stock tracking, automated purchase ordering, and visual inventory management. This project demonstrates the practical application of relational database principles, asynchronous data handling, and professional UI/UX design.

<img width="1912" height="977" alt="image" src="https://github.com/user-attachments/assets/874a1cc6-df72-4487-9359-9f26df81f512" />


## 🛠️ Technical Stack
* **Frontend:** HTML5, CSS3 (Custom Grid/Flexbox), Vanilla JavaScript (ES6+ Modules)
* **Backend:** PHP 8.x (PDO for Secure Database Communication)
* **Database:** MariaDB / MySQL (Relational Schema)
* **Icons:** FontAwesome 6.4

## 📊 Database Architecture (Semester Mastery)
This project serves as a comprehensive demonstration of 1st-semester database concepts:

* **Normalization:** The schema follows **Second Normal Form (2NF)** and **Third Normal Form (3NF)** principles to eliminate data redundancy and ensure atomic data storage.
* **Relational Mapping:** Implements **One-to-Many relationships** across five core tables: `users`, `products`, `categories`, `purchase_orders`, and `stock_history`.
* **Referential Integrity:** Utilizes `FOREIGN KEY` constraints to enforce business rules and prevent "orphan" records during deletion or updates.
* **Complex SQL Joins:** Advanced use of `LEFT JOIN` and `INNER JOIN` to aggregate data from multiple tables into a single user view.
* **ACID Transactions:** Backend logic uses PHP `PDO::beginTransaction` to ensure that complex operations (like receiving an order) are atomic and consistent.



## ✨ Key Features
* **Visual Inventory:** Circular product thumbnails with automated default fallback icons for items without uploaded photos.
* **Secure CRUD:** Fully functional Create, Read, Update, and Delete operations with cascading delete logic to maintain database history.
* **Stock History Tracking:** Automated audit logs that record every sale or restock action, including user handles and timestamps.
* **Responsive Dashboard:** Real-time analytics showing Total Value (PHP), Low Stock Alerts, and Pending Orders.
* **Data Export:** One-click CSV export functionality for physical stock auditing.



## 🔧 Installation & Setup
1.  Clone the repository to your local server directory (e.g., `htdocs` for XAMPP).
2.  Import the provided `inventory_system_db.sql` dump into your **phpMyAdmin**.
3.  Ensure your `db_connect.php` credentials match your local environment.
4.  Launch `index.html` via `localhost`.

## 👥 Group Members
* **Group 8 - Computer Science Students**
* *Laguna, Philippines*


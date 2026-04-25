-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 03:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cabuyao_inventory_grp8`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(3, 'Accessories'),
(1, 'Electronics'),
(4, 'Furniture'),
(2, 'Office Supplies');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `supplier` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `owner_username` varchar(255) DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `supplier`, `category`, `quantity`, `price`, `description`, `created_at`, `updated_at`, `owner_username`, `cat_id`) VALUES
(1, 'Wireless Mouse', 'LogiTech Dist.', 'Electronics', 45, 350.00, 'Ergonomic 2.4Ghz wireless mouse', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(2, 'Mechanical Keyboard', 'TechSource Inc.', 'Electronics', 12, 1200.00, 'RGB Blue Switch Mechanical Keyboard', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(3, 'USB-C Cable 2m', 'Cables&Co', 'Accessories', 5, 150.00, 'Braided fast-charging cable', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(4, 'Adjustable Monitor Stand', 'ErgoWorks', 'Accessories', 10, 850.00, 'Aluminum dual-monitor desk mount', '2026-04-22 13:55:35', '2026-04-22 15:07:09', NULL, NULL),
(6, 'Phone', 'ErgoWorks', 'Electronics', 1, 12222.00, '121', '2026-04-22 15:09:29', '2026-04-22 15:09:29', NULL, NULL),
(7, 'Adjustable Monitor Stand', 'TETE', 'Electronics', 12, 1.00, '1', '2026-04-22 15:26:36', '2026-04-22 15:29:37', NULL, NULL),
(8, 'Phone', 'TETE', 'Electronics', 1, 1.00, '11', '2026-04-23 02:25:14', '2026-04-23 02:25:14', NULL, NULL),
(10, 'microwave', 'shopee', '', 29, 1500.00, 'none', '2026-04-24 14:00:36', '2026-04-25 00:48:10', 'admin', 1),
(12, 'Phone', 'ErgoWorks', '', 10, 12.00, NULL, '2026-04-24 14:48:18', '2026-04-24 14:48:18', 'bril', 1),
(13, 'keyboard', 'aegis', '', 1, 12.00, NULL, '2026-04-25 01:15:13', '2026-04-25 01:15:13', 'bril', 3);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `po_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `order_qty` int(11) NOT NULL,
  `status` enum('Pending','Received','Cancelled') DEFAULT 'Pending',
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`po_id`, `product_id`, `order_qty`, `status`, `date_created`) VALUES
(1, 10, 1, 'Received', '2026-04-24 14:15:48'),
(2, 10, 1, 'Received', '2026-04-24 14:27:44'),
(3, 10, 10, 'Received', '2026-04-25 00:48:06');

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `history_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_handle` varchar(50) DEFAULT NULL,
  `quantity_changed` int(11) DEFAULT NULL,
  `action_type` enum('SALE','RESTOCK','ADJUSTMENT') DEFAULT NULL,
  `date_recorded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_history`
--

INSERT INTO `stock_history` (`history_id`, `product_id`, `user_handle`, `quantity_changed`, `action_type`, `date_recorded`) VALUES
(4, 10, 'admin', -1, 'SALE', '2026-04-24 14:00:45'),
(5, 10, 'admin', 1, 'RESTOCK', '2026-04-24 14:18:11'),
(6, 10, 'admin', -1, 'SALE', '2026-04-24 14:27:35'),
(7, 10, 'admin', 1, 'RESTOCK', '2026-04-25 00:48:08'),
(8, 10, 'admin', 10, 'RESTOCK', '2026-04-25 00:48:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `fullname` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT 'profile_C.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`, `fullname`, `profile_pic`) VALUES
(1, 'admin', 'password', 'admin', '2026-04-22 13:55:35', NULL, 'img/admin_1777078896.jpg'),
(2, 'student', '12345', 'staff', '2026-04-22 13:55:35', NULL, 'profile_C.jpg'),
(3, 'bril', '123', 'admin', '2026-04-23 02:15:59', 'justinbril abarquez', 'bril_1776913149.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category` (`cat_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`po_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `po_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `stock_history_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

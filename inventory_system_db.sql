-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 11:42 AM
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
  `image_path` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `supplier` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `owner_username` varchar(255) DEFAULT NULL,
  `cat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `image_path`, `name`, `supplier`, `category`, `quantity`, `price`, `owner`, `description`, `created_at`, `updated_at`, `owner_username`, `cat_id`) VALUES
(1, NULL, 'Wireless Mouse', 'LogiTech Dist.', 'Electronics', 45, 350.00, '', 'Ergonomic 2.4Ghz wireless mouse', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(2, NULL, 'Mechanical Keyboard', 'TechSource Inc.', 'Electronics', 12, 1200.00, '', 'RGB Blue Switch Mechanical Keyboard', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(3, NULL, 'USB-C Cable 2m', 'Cables&Co', 'Accessories', 5, 150.00, '', 'Braided fast-charging cable', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL, NULL),
(4, NULL, 'Adjustable Monitor Stand', 'ErgoWorks', 'Accessories', 10, 850.00, '', 'Aluminum dual-monitor desk mount', '2026-04-22 13:55:35', '2026-04-22 15:07:09', NULL, NULL),
(6, NULL, 'Phone', 'ErgoWorks', 'Electronics', 1, 12222.00, '', '121', '2026-04-22 15:09:29', '2026-04-22 15:09:29', NULL, NULL),
(7, NULL, 'Adjustable Monitor Stand', 'TETE', 'Electronics', 12, 1.00, '', '1', '2026-04-22 15:26:36', '2026-04-22 15:29:37', NULL, NULL),
(8, NULL, 'Phone', 'TETE', 'Electronics', 1, 1.00, '', '11', '2026-04-23 02:25:14', '2026-04-23 02:25:14', NULL, NULL),
(12, NULL, 'Phone', 'ErgoWorks', '', 10, 12.00, '', NULL, '2026-04-24 14:48:18', '2026-04-24 14:48:18', 'bril', 1),
(13, NULL, 'keyboard', 'aegis', '', 1, 12.00, '', NULL, '2026-04-25 01:15:13', '2026-04-25 01:15:13', 'bril', 3),
(16, NULL, 'microwave', 'ErgoWorks', '', 0, 333.00, 'admin', NULL, '2026-04-25 02:26:33', '2026-04-25 07:59:19', NULL, 2),
(19, 'img/prod_1777097006_634.png', 'keyboard', 'tiktok', '', 9, 100.00, 'bril', NULL, '2026-04-25 06:03:26', '2026-04-25 07:58:58', NULL, 3),
(20, 'img/prod_1777109831_975.png', 'Table', 'IKEA', '', 120, 1000.00, 'bril', NULL, '2026-04-25 09:37:11', '2026-04-25 09:39:10', NULL, 4),
(21, 'img/prod_1777110001_348.png', 'Iphone 17', 'APPLE', '', 100, 70000.00, 'bril', NULL, '2026-04-25 09:40:01', '2026-04-25 09:40:01', NULL, 1),
(22, 'img/prod_1777110037_360.png', 'Pen', 'National Book store', '', 500, 50.00, 'bril', NULL, '2026-04-25 09:40:37', '2026-04-25 09:40:37', NULL, 2),
(23, 'img/prod_1777110088_293.png', 'CH-Necklace', 'Chrome Hearts', '', 1000, 500.00, 'bril', NULL, '2026-04-25 09:41:28', '2026-04-25 09:41:28', NULL, 3);

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
(6, 19, 10, 'Received', '2026-04-25 06:03:49');

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
(15, 19, 'bril', 10, 'RESTOCK', '2026-04-25 06:03:51'),
(16, 16, 'admin', -9, 'SALE', '2026-04-25 07:59:19');

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
(1, 'admin', 'password', 'admin', '2026-04-22 13:55:35', NULL, 'img/admin_1777081151.png'),
(2, 'student', '12345', 'staff', '2026-04-22 13:55:35', NULL, 'profile_C.jpg'),
(3, 'bril', '123', 'admin', '2026-04-23 02:15:59', 'justinbril abarquez', 'img/bril_1777097217.png');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `po_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 23, 2026 at 05:03 AM
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
  `owner_username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `supplier`, `category`, `quantity`, `price`, `description`, `created_at`, `updated_at`, `owner_username`) VALUES
(1, 'Wireless Mouse', 'LogiTech Dist.', 'Electronics', 45, 350.00, 'Ergonomic 2.4Ghz wireless mouse', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL),
(2, 'Mechanical Keyboard', 'TechSource Inc.', 'Electronics', 12, 1200.00, 'RGB Blue Switch Mechanical Keyboard', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL),
(3, 'USB-C Cable 2m', 'Cables&Co', 'Accessories', 5, 150.00, 'Braided fast-charging cable', '2026-04-22 13:55:35', '2026-04-22 13:55:35', NULL),
(4, 'Adjustable Monitor Stand', 'ErgoWorks', 'Accessories', 10, 850.00, 'Aluminum dual-monitor desk mount', '2026-04-22 13:55:35', '2026-04-22 15:07:09', NULL),
(6, 'Phone', 'ErgoWorks', 'Electronics', 1, 12222.00, '121', '2026-04-22 15:09:29', '2026-04-22 15:09:29', NULL),
(7, 'Adjustable Monitor Stand', 'TETE', 'Electronics', 12, 1.00, '1', '2026-04-22 15:26:36', '2026-04-22 15:29:37', NULL),
(8, 'Phone', 'TETE', 'Electronics', 1, 1.00, '11', '2026-04-23 02:25:14', '2026-04-23 02:25:14', NULL),
(9, 'Phone', 'TETE', 'Electronics', 3, 1.00, NULL, '2026-04-23 02:28:55', '2026-04-23 02:28:55', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `po_number` varchar(20) NOT NULL,
  `product_id` int(11) NOT NULL,
  `supplier` varchar(100) NOT NULL,
  `qty` int(11) NOT NULL,
  `status` enum('Pending','Received') DEFAULT 'Pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`po_number`, `product_id`, `supplier`, `qty`, `status`, `order_date`) VALUES
('PO-1023', 4, 'ErgoWorks', 15, 'Received', '2026-04-22 13:55:35'),
('PO-8492', 3, 'Cables&Co', 50, 'Pending', '2026-04-22 13:55:35');

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
(1, 'admin', 'password', 'admin', '2026-04-22 13:55:35', NULL, 'profile_C.jpg'),
(2, 'student', '12345', 'staff', '2026-04-22 13:55:35', NULL, 'profile_C.jpg'),
(3, 'bril', '123', 'admin', '2026-04-23 02:15:59', 'justinbril abarquez', 'bril_1776913149.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`po_number`),
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
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

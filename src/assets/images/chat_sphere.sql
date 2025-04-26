-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2025 at 09:14 AM
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
-- Database: `chat_sphere`
--

-- --------------------------------------------------------

--
-- Table structure for table `calls`
--

CREATE TABLE `calls` (
  `id` int(11) NOT NULL,
  `caller_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `type` enum('audio','video') NOT NULL,
  `status` enum('initiated','accepted','rejected','cancelled','ended') NOT NULL,
  `start_time` datetime DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calls`
--

INSERT INTO `calls` (`id`, `caller_id`, `receiver_id`, `type`, `status`, `start_time`, `end_time`) VALUES
(1, 50, 48, 'audio', 'initiated', '2025-04-26 12:41:05', NULL),
(2, 50, 48, 'audio', 'initiated', '2025-04-26 12:41:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `sender_id` int(255) NOT NULL,
  `reciver_id` int(255) NOT NULL,
  `message` text NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','delivered','read') DEFAULT 'sent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `sender_id`, `reciver_id`, `message`, `file_url`, `file_type`, `time`, `status`) VALUES
(18, 49, 48, 'll', '', 'text', '2025-03-11 10:29:28', 'sent'),
(19, 49, 48, 'll', '', 'text', '2025-03-11 10:29:57', 'sent'),
-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` int(11) NOT NULL,
  `peer_ID` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'https://cdn-icons-png.flaticon.com/128/2102/2102647.png',
  `password` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `lat` varchar(255) NOT NULL,
  `long` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `craeted_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `otp`, `peer_ID`, `image`, `password`, `location`, `lat`, `long`, `status`, `craeted_at`, `last_login`) VALUES
(48, 'Avinay Kumar', 'avinayquicktech@gmail.com', 0, '19879987-c724-4913-aa30-2ed27281c7ac', '/profile/avinayquicktech_gmail_com.jpg', '', 'Ghurlu Nala Bridge, Dharamshala Palampur Road, Prem Nagar, Sukar, Sidhpur, Dharamshala, Kangra, Himachal Pradesh, 176200, India', '32.1930411', '76.3484279', 'verify', '2025-03-11 10:11:02', '2025-04-26 12:03:17'),
(49, 'Test Kumar', 'testk805@gmail.com', 0, '8c55ee88-db53-46a2-abfd-0f491c4847f9', '/profile/testk805_gmail_com.jpg', '1', 'Ghurlu Nala Bridge, Dharamshala Palampur Road, Prem Nagar, Sukar, Sidhpur, Dharamshala, Kangra, Himachal Pradesh, 176200, India', '32.1930376', '76.348431', 'verify', '2025-03-11 10:29:21', '2025-04-26 10:22:49'),
(50, 'Aman', 'Aman@gmail.com', 0, '14bbdec3-1c38-4ceb-b37a-51fcf6bb16f3', '/profile/testk805_gmail_com.jpg', '1', 'YOL Cantt', '32.177118743725245', '76.38283537164781', 'verify', '2025-03-11 10:29:21', '2025-03-11 14:46:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calls`
--
ALTER TABLE `calls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `caller_id` (`caller_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calls`
--
ALTER TABLE `calls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `calls`
--
ALTER TABLE `calls`
  ADD CONSTRAINT `calls_ibfk_1` FOREIGN KEY (`caller_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `calls_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

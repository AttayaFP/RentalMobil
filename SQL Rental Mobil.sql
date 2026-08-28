/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.30 : Database - rental_mobil
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`rental_mobil` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rental_mobil`;

/*Table structure for table `booking_mobil` */

DROP TABLE IF EXISTS `booking_mobil`;

CREATE TABLE `booking_mobil` (
  `kdbooking` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tglbooking` date DEFAULT NULL,
  `iduser` bigint unsigned DEFAULT NULL,
  `kdmobil` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `harga` double DEFAULT NULL,
  `payment_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tglmulai` date DEFAULT NULL,
  `tglselesai` date DEFAULT NULL,
  `lama_sewa` int DEFAULT NULL,
  `total_bayar` double DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_time` datetime DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kdbooking`),
  KEY `booking_mobil_iduser_foreign` (`iduser`),
  KEY `booking_mobil_kdmobil_foreign` (`kdmobil`),
  CONSTRAINT `booking_mobil_iduser_foreign` FOREIGN KEY (`iduser`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_mobil_kdmobil_foreign` FOREIGN KEY (`kdmobil`) REFERENCES `mobil` (`kdmobil`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `booking_mobil` */

insert  into `booking_mobil`(`kdbooking`,`tglbooking`,`iduser`,`kdmobil`,`harga`,`payment_type`,`payment_method`,`tglmulai`,`tglselesai`,`lama_sewa`,`total_bayar`,`transaction_id`,`transaction_time`,`status`,`created_at`,`updated_at`) values 
('BO001','2026-08-03',1,'M001',500000,NULL,'Midtrans','2026-08-03','2026-08-05',3,1500000,'TRX-D4139412','2026-08-03 10:45:49','Expired','2026-08-03 10:45:49','2026-08-03 10:46:58'),
('BO002','2026-08-03',5,'M001',500000,'reminder','reminder','2026-08-03','2026-08-04',1,500000,'REM-1785753983','2026-08-03 10:46:23','Notified','2026-08-03 10:46:23','2026-08-03 10:46:58'),
('BO003','2026-08-03',1,'M001',500000,NULL,'Midtrans','2026-08-03','2026-08-05',3,1500000,'TRX-1FEBD846','2026-08-03 10:57:53','Expired','2026-08-03 10:57:53','2026-08-03 10:59:01'),
('BO004','2026-08-03',1,'MBL-001',300000,NULL,'Midtrans','2026-08-03','2026-08-05',3,900000,'TRX-A3194547','2026-08-03 11:11:10','Expired','2026-08-03 11:11:10','2026-08-03 11:12:12'),
('BO005','2026-08-03',5,'MBL-001',300000,'reminder','reminder','2026-08-03','2026-08-04',1,300000,'REM-1785755497','2026-08-03 11:11:37','Notified','2026-08-03 11:11:37','2026-08-03 11:12:14'),
('BO006','2026-08-03',1,'M001',500000,NULL,'Midtrans','2026-08-03','2026-08-05',3,1500000,'TRX-0FE31442','2026-08-03 11:14:07','Expired','2026-08-03 11:14:07','2026-08-03 11:15:16'),
('BO007','2026-08-03',1,'M001',500000,NULL,'Midtrans','2026-08-03','2026-08-05',3,1500000,'TRX-BBBEC004','2026-08-03 11:21:56','Expired','2026-08-03 11:21:56','2026-08-03 11:22:57'),
('BO008','2026-08-03',5,'M001',500000,NULL,'Midtrans','2026-08-03','2026-08-05',3,1500000,'TRX-C55F3B57','2026-08-03 11:28:37','Expired','2026-08-03 11:28:37','2026-08-03 11:53:35'),
('BO009','2026-08-03',5,'MBL-001',300000,'bank_transfer','bank_transfer','2026-08-04','2026-08-06',3,900000,'83cd4ddc-ae24-4708-884e-c7e15f17474a','2026-08-04 07:00:04','Batal','2026-08-03 23:59:57','2026-08-04 00:20:54'),
('BO010','2026-08-04',5,'M001',500000,'bank_transfer','bank_transfer','2026-08-04','2026-08-05',2,1000000,'c9c193de-3848-49f4-aae4-5f35c3bbfdf6','2026-08-04 07:37:43','Selesai','2026-08-04 00:37:38','2026-08-19 15:56:44');

/*Table structure for table `cache` */

DROP TABLE IF EXISTS `cache`;

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache` */

/*Table structure for table `cache_locks` */

DROP TABLE IF EXISTS `cache_locks`;

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache_locks` */

/*Table structure for table `failed_jobs` */

DROP TABLE IF EXISTS `failed_jobs`;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `failed_jobs` */

/*Table structure for table `job_batches` */

DROP TABLE IF EXISTS `job_batches`;

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `job_batches` */

/*Table structure for table `jobs` */

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `jobs` */

/*Table structure for table `kategori` */

DROP TABLE IF EXISTS `kategori`;

CREATE TABLE `kategori` (
  `kdkategori` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_kategori` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kdkategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `kategori` */

insert  into `kategori`(`kdkategori`,`nama_kategori`,`created_at`,`updated_at`) values 
('K001','Matic','2026-06-24 00:06:43','2026-06-24 00:06:43'),
('K002','Manual','2026-06-24 00:06:43','2026-06-24 00:06:43');

/*Table structure for table `kembali_mobil` */

DROP TABLE IF EXISTS `kembali_mobil`;

CREATE TABLE `kembali_mobil` (
  `kdpengembalian` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kdbooking` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iduser` bigint unsigned DEFAULT NULL,
  `tglmulai` date DEFAULT NULL,
  `tglselesai` date DEFAULT NULL,
  `tglpengembalian` date DEFAULT NULL,
  `keterlambatan` int DEFAULT NULL,
  `denda` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kdpengembalian`),
  KEY `kembali_mobil_iduser_foreign` (`iduser`),
  KEY `kembali_mobil_kdbooking_foreign` (`kdbooking`),
  CONSTRAINT `kembali_mobil_iduser_foreign` FOREIGN KEY (`iduser`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kembali_mobil_kdbooking_foreign` FOREIGN KEY (`kdbooking`) REFERENCES `booking_mobil` (`kdbooking`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `kembali_mobil` */

insert  into `kembali_mobil`(`kdpengembalian`,`kdbooking`,`iduser`,`tglmulai`,`tglselesai`,`tglpengembalian`,`keterlambatan`,`denda`,`created_at`,`updated_at`) values 
('KMB-001','BO010',5,'2026-08-04','2026-08-05','2026-08-19',14,7000000,'2026-08-19 15:56:44','2026-08-19 15:56:44');

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `migrations` */

insert  into `migrations`(`id`,`migration`,`batch`) values 
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_05_04_041259_create_kategoris_table',1),
(5,'2026_05_04_041300_create_mobils_table',1),
(6,'2026_05_04_041302_create_booking_mobils_table',1),
(7,'2026_05_04_041303_create_kembali_mobils_table',1),
(8,'2026_05_04_082246_add_status_to_mobil_table',1),
(9,'2026_05_08_081234_add_status_to_mobil_table',1),
(10,'2026_06_30_094611_create_notifikasis_table',2),
(11,'2026_08_03_000001_add_fcm_token_to_users_table',3),
(12,'2026_08_03_072659_add_fcm_token_to_users_table',3);

/*Table structure for table `mobil` */

DROP TABLE IF EXISTS `mobil`;

CREATE TABLE `mobil` (
  `kdmobil` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_mobil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thn_mobil` int DEFAULT NULL,
  `plat_mobil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warna_mobil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stnk_mobil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `harga` double DEFAULT NULL,
  `kdkategori` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Tersedia','Disewa','Perawatan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Tersedia',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kdmobil`),
  KEY `mobil_kdkategori_foreign` (`kdkategori`),
  CONSTRAINT `mobil_kdkategori_foreign` FOREIGN KEY (`kdkategori`) REFERENCES `kategori` (`kdkategori`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `mobil` */

insert  into `mobil`(`kdmobil`,`nama_mobil`,`thn_mobil`,`plat_mobil`,`warna_mobil`,`stnk_mobil`,`harga`,`kdkategori`,`foto`,`status`,`created_at`,`updated_at`) values 
('M001','Toyota Fortuner',2023,'B 1234 ABC','Putih','12345678',500000,'K002','mobils/emJAr03h9jWeN5SXkhscUPRBFeJ33a8hqmiDc45k.jpg','Perawatan','2026-06-24 00:06:43','2026-08-19 15:56:44'),
('M002','Honda Civic',2022,'B 5678 DEF','Putih','87654321',450000,'K001','mobils/pgDtJMKYdwuJZas9BDX8y5Bvg1X87qfdT0fakdgX.jpg','Tersedia','2026-06-24 00:06:43','2026-08-03 10:44:37'),
('M003','Mitsubishi Pajero Sport',2023,'B 9012 GHI','Hitam','11223344',550000,'K001','mobils/JpIb8v5LqGcBCpczIZN7sPNzdSwzGs9Mwvz0qISO.jpg','Tersedia','2026-06-24 00:06:43','2026-08-03 10:44:56'),
('MBL-001','Ayla',2024,'BA 1230 AA','Putih','019323134',300000,'K001','mobils/KKgYcvsdVZ0EXxq76ek2XS7dIDA8n8Fak1gkES1w.jpg','Tersedia','2026-06-24 03:34:48','2026-08-04 00:20:54');

/*Table structure for table `notifikasis` */

DROP TABLE IF EXISTS `notifikasis`;

CREATE TABLE `notifikasis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `iduser` bigint unsigned NOT NULL,
  `kdmobil` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pesan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifikasis_iduser_foreign` (`iduser`),
  KEY `notifikasis_kdmobil_foreign` (`kdmobil`),
  CONSTRAINT `notifikasis_iduser_foreign` FOREIGN KEY (`iduser`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifikasis_kdmobil_foreign` FOREIGN KEY (`kdmobil`) REFERENCES `mobil` (`kdmobil`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `notifikasis` */

insert  into `notifikasis`(`id`,`iduser`,`kdmobil`,`pesan`,`is_read`,`created_at`,`updated_at`) values 
(16,3,'M001','Kabar baik! Mobil Toyota Fortuner yang sebelumnya ingin Anda sewa pada tanggal 04-07-2026 s/d 06-07-2026 kini sudah tersedia kembali. Silakan lakukan pemesanan ulang!',1,'2026-07-03 17:25:39','2026-07-03 17:31:08'),
(25,3,'M001','Kabar baik! Mobil Toyota Fortuner yang sebelumnya ingin Anda sewa pada tanggal 07-07-2026 s/d 08-07-2026 kini sudah tersedia kembali. Silakan lakukan pemesanan ulang!',1,'2026-07-06 04:10:08','2026-07-06 04:10:34'),
(26,3,'M001','Kabar baik! Mobil Toyota Fortuner yang sebelumnya ingin Anda sewa pada tanggal 07-07-2026 s/d 08-07-2026 kini sudah tersedia kembali. Silakan lakukan pemesanan ulang!',1,'2026-07-06 04:11:17','2026-07-06 04:35:48'),
(41,2,'MBL-001','Pembatalan Booking #BO009 oleh pradana. Mohon refund 50% (Rp 450.000) ke Mandiri - 01823276781 a.n Attaya.',0,'2026-08-04 00:20:54','2026-08-04 00:20:54');

/*Table structure for table `password_reset_tokens` */

DROP TABLE IF EXISTS `password_reset_tokens`;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `password_reset_tokens` */

insert  into `password_reset_tokens`(`email`,`token`,`created_at`) values 
('admin@gmail.com','$2y$12$WmOXiM7bInbWUugsqCpqCuI6PbQObV9N4.uuhoktypN0cdWJkbnwC','2026-08-19 15:48:46');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sessions` */

insert  into `sessions`(`id`,`user_id`,`ip_address`,`user_agent`,`payload`,`last_activity`) values 
('tVQYUGUx5hgKOK2Xl3dkHbUXKG7nzMvtItRkiFbV',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiVW9PWmJId3R6WlJrQXFyMUg4QUVuc2ZUdGJUNERxWFdaNFE1ZmZYQSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1787134639);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_lengkap` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_kelamin` enum('L','P') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nohp` char(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('pelanggan','admin','pimpinan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pelanggan',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`username`,`nama_lengkap`,`jenis_kelamin`,`alamat`,`nohp`,`foto`,`role`,`password`,`email_verified_at`,`remember_token`,`created_at`,`updated_at`) values 
(1,'admin@gmail.com','testuser','admin','L','47504 Frances Cape Suite 162\nTyraberg, NY 58936','1-650-654-1225',NULL,'admin','$2y$12$75hTAL4I5rZs0rksK.AC9OSABAdcYdz2YG4FLQvjE6R0I6dzsUVcm','2026-06-24 00:06:43','P11DxpxApBoeXiTnaS07GyBIsgHQAakjdnAM1iGGjWowVEKmVsMQ7ftEkR5h','2026-06-24 00:06:43','2026-08-19 15:56:02'),
(2,'pimpinan@gmail.com','testuser','Pimpinan','P','5153 Delbert Oval Suite 714\nNew Ciaraside, WA 20551','+1 (240) 858-13',NULL,'pimpinan','$2y$12$8Tfi1K4X1Yx8QooZle67r.80XjqejUIkjBPRNxRK5UXxG7VCLqXKe','2026-06-24 00:06:43','zBWWgzbvgsg2BkjR98Jw3zzNMlbYjlQo4pBeedAHuoIeVPaqBxjJg5C2N9PC','2026-06-24 00:06:43','2026-06-24 00:07:00'),
(3,'pelanggan@gmail.com','pelanggan','Pelanggan','L','Padang','083123178293','users/uWhMRKdj2z35X7gEw7cTF0pBZNnXTHJDcLizhgEL.png','pelanggan','$2y$12$0gSCmyfFW6dLwZlZYa.4ZeLlc59WfP4PDSovhHYB1OcpP063fI8ai',NULL,NULL,'2026-06-24 00:53:12','2026-06-24 00:53:12'),
(4,'pakisnardi@gmail.com','Isnardi','Isnardi','L','Padang','08312317342421','users/OYGeP5RxsiUc7pdUZ3Bcl0lJ4Zk2oZoWQchCM396.jpg','pelanggan','$2y$12$ZEf5CoQahcvuuV8bX01MWOP7UKlEjimen.K4I1RGK7PxT95yiak1.',NULL,NULL,'2026-06-24 04:29:27','2026-06-24 04:29:27'),
(5,'pradana@gmail.com','pradana','pradana','L','Payakumbuh','083123178931','users/QwGBji2eiJlsMNlvXHFPJAMhtkZ5Sv84VpiAz7Os.png','pelanggan','$2y$12$luf7bu69ImVrziHSuF24sOAbflk6fVuYYeb9kfO7SfwvH3QgucQwm',NULL,NULL,'2026-07-05 06:44:18','2026-07-13 21:11:23');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

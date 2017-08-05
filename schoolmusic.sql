-- phpMyAdmin SQL Dump
-- version 4.6.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-08-05 18:46:28
-- 服务器版本： 5.6.19
-- PHP Version: 7.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `schoolmusic`
--

-- --------------------------------------------------------

--
-- 表的结构 `files`
--

CREATE TABLE `files` (
  `id` smallint(9) NOT NULL COMMENT 'ID',
  `md5` tinytext NOT NULL COMMENT '文件md5',
  `uploader` varchar(11) NOT NULL COMMENT '上传者学号',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除标志'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `files`
--

INSERT INTO `files` (`id`, `md5`, `uploader`, `time`, `deleted_at`) VALUES
(1, '***REMOVED***', '0', '2017-07-27 12:40:49', NULL),
(2, 'dhdbjxidjshhsjaks', '***REMOVED***', '2017-07-27 15:24:03', NULL),
(3, 'sbcjjsbwkdbjbnok', '***REMOVED***', '2017-07-27 15:26:01', NULL),
(4, 'aldjkcnososnodixbsjaosjxbxjosoaowjnsi', '***REMOVED***', '2017-07-27 15:28:49', NULL),
(5, '***REMOVED***', '0', '2017-07-29 12:54:56', NULL),
(6, '***REMOVED***', '***REMOVED***', '2017-08-01 14:28:07', NULL),
(7, '***REMOVED***', '***REMOVED***', '2017-08-01 15:16:34', NULL),
(8, '***REMOVED***', '***REMOVED***', '2017-08-03 14:49:18', NULL),
(9, '***REMOVED***', '***REMOVED***', '2017-08-05 16:10:49', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `reports`
--

CREATE TABLE `reports` (
  `id` smallint(6) NOT NULL COMMENT 'ID',
  `song_id` smallint(6) NOT NULL COMMENT '曲目ID',
  `reason` tinytext NOT NULL COMMENT '原因',
  `reporter` varchar(11) NOT NULL COMMENT '举报者学号',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `reports`
--

INSERT INTO `reports` (`id`, `song_id`, `reason`, `reporter`, `time`) VALUES
(1, 1, 'bluh', '***REMOVED***', '2017-08-01 16:14:24'),
(2, 4, 'bluh', '***REMOVED***', '2017-08-03 14:59:52');

-- --------------------------------------------------------

--
-- 表的结构 `songs`
--

CREATE TABLE `songs` (
  `id` smallint(6) NOT NULL COMMENT 'ID',
  `playtime` tinyint(1) NOT NULL COMMENT '播放时段',
  `name` tinytext NOT NULL COMMENT '曲名',
  `origin` tinytext COMMENT '来源',
  `uploader` varchar(11) NOT NULL COMMENT '上传者学号',
  `file_id` smallint(6) NOT NULL COMMENT '文件ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除标志'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `songs`
--

INSERT INTO `songs` (`id`, `playtime`, `name`, `origin`, `uploader`, `file_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '***REMOVED***', '***REMOVED***', '0', 1, '2017-07-27 12:40:49', NULL, NULL),
(8, 1, '***REMOVED***', '***REMOVED***', '***REMOVED***', 6, '2017-08-01 14:28:07', NULL, NULL),
(9, 2, '***REMOVED***', '***REMOVED***', '***REMOVED***', 7, '2017-08-01 15:16:34', NULL, NULL),
(4, 1, '***REMOVED***', '***REMOVED***', '***REMOVED***', 3, '2017-07-27 15:28:19', NULL, NULL),
(16, 1, '***REMOVED***', '', '***REMOVED***', 9, '2017-08-06 00:24:13', '2017-08-06 00:35:49', NULL),
(6, 1, '***REMOVED***', '***REMOVED***', '0', 5, '2017-07-29 12:58:34', NULL, NULL),
(10, 1, '***REMOVED***', '***REMOVED***', '***REMOVED***', 8, '2017-08-03 14:49:18', NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `votes`
--

CREATE TABLE `votes` (
  `id` mediumint(9) NOT NULL COMMENT 'ID',
  `song_id` smallint(6) NOT NULL COMMENT '曲目ID',
  `vote` tinyint(3) NOT NULL COMMENT '投票',
  `voter` varchar(11) NOT NULL COMMENT '投票者学号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最后更新时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `votes`
--

INSERT INTO `votes` (`id`, `song_id`, `vote`, `voter`, `created_at`, `updated_at`) VALUES
(8, 1, 5, '***REMOVED***', '2017-07-31 12:34:17', NULL),
(7, 3, 10, '***REMOVED***', '2017-07-28 09:03:38', NULL),
(6, 1, -10, '***REMOVED***', '2017-07-28 09:03:59', NULL),
(5, 2, 10, '***REMOVED***', '2017-07-28 09:02:37', NULL),
(9, 10, 10, '***REMOVED***', '2017-08-03 14:59:41', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `ref_time` (`uploader`,`created_at`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `files`
--
ALTER TABLE `files`
  MODIFY `id` smallint(9) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=10;
--
-- 使用表AUTO_INCREMENT `reports`
--
ALTER TABLE `reports`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=3;
--
-- 使用表AUTO_INCREMENT `songs`
--
ALTER TABLE `songs`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=17;
--
-- 使用表AUTO_INCREMENT `votes`
--
ALTER TABLE `votes`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

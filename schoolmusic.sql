-- phpMyAdmin SQL Dump
-- version 4.6.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2017-08-28 19:13:51
-- 服务器版本： 5.6.19
-- PHP Version: 7.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+08:00";


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
  `md5` varchar(32) NOT NULL COMMENT '文件md5',
  `uploader` char(11) NOT NULL COMMENT '上传者学号',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除标志'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='文件' ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `files`
--

INSERT INTO `files` (`id`, `md5`, `uploader`, `time`, `deleted_at`) VALUES
(1, '***REMOVED***', '0', '2017-07-27 12:40:49', NULL),
(2, 'dhdbjxidjshhsjaks', '***REMOVED***', '2017-07-27 15:24:03', NULL),
(3, 'sbcjjsbwkdbjbnok', '***REMOVED***', '2017-07-27 15:26:01', NULL),
(4, 'aldjkcnososnodixbsjaosjxbxjosoao', '***REMOVED***', '2017-07-27 15:28:49', NULL),
(5, '***REMOVED***', '0', '2017-07-29 12:54:56', NULL),
(6, '***REMOVED***', '***REMOVED***', '2017-08-01 14:28:07', NULL),
(7, '***REMOVED***', '***REMOVED***', '2017-08-01 15:16:34', NULL),
(8, '***REMOVED***', '***REMOVED***', '2017-08-03 14:49:18', NULL),
(9, '***REMOVED***', '***REMOVED***', '2017-08-05 16:10:49', NULL),
(10, '***REMOVED***', '***REMOVED***', '2017-08-07 09:00:04', NULL),
(11, '***REMOVED***', '***REMOVED***', '2017-08-07 09:05:41', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `options`
--

CREATE TABLE `options` (
  `name` varchar(10) NOT NULL COMMENT '字段名',
  `value` tinytext COMMENT '值',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='配置';

--
-- 转存表中的数据 `options`
--

INSERT INTO `options` (`name`, `value`, `updated_at`) VALUES
('censor', '', '2017-08-15 16:04:04'),
('ban_upload', NULL, '2017-08-14 15:57:59'),
('ban_vote', NULL, '2017-08-14 15:39:58');

-- --------------------------------------------------------

--
-- 表的结构 `orders`
--

CREATE TABLE `orders` (
  `user_id` char(11) NOT NULL COMMENT '学号',
  `order` tinytext NOT NULL COMMENT '曲目顺序'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='曲目顺序';

--
-- 转存表中的数据 `orders`
--

INSERT INTO `orders` (`user_id`, `order`) VALUES
('***REMOVED***', '1,20,9,19,18,6,8,10,4');

-- --------------------------------------------------------

--
-- 表的结构 `reports`
--

CREATE TABLE `reports` (
  `id` smallint(6) NOT NULL COMMENT 'ID',
  `song_id` smallint(6) NOT NULL COMMENT '曲目ID',
  `reason` varchar(60) NOT NULL COMMENT '原因',
  `reporter` char(11) NOT NULL COMMENT '举报者学号',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='举报';

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
  `playtime` enum('1','2','3','4','5','6') NOT NULL COMMENT '播放时段',
  `name` varchar(30) NOT NULL COMMENT '曲名',
  `origin` varchar(50) DEFAULT NULL COMMENT '来源',
  `uploader` char(11) NOT NULL COMMENT '上传者学号',
  `file_id` smallint(6) NOT NULL COMMENT '文件ID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最后更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '软删除标志'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='曲目';

--
-- 转存表中的数据 `songs`
--

INSERT INTO `songs` (`id`, `playtime`, `name`, `origin`, `uploader`, `file_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '1', '***REMOVED***', '***REMOVED***', '0', 1, '2017-07-27 12:40:49', NULL, NULL),
(8, '1', '***REMOVED***', '***REMOVED***', '***REMOVED***', 6, '2017-08-01 14:28:07', NULL, NULL),
(9, '2', '***REMOVED***', '***REMOVED***', '***REMOVED***', 7, '2017-08-01 15:16:34', NULL, NULL),
(4, '1', '***REMOVED***', '***REMOVED***', '***REMOVED***', 3, '2017-07-27 15:28:19', NULL, NULL),
(18, '2', '***REMOVED*** ', '***REMOVED***', '***REMOVED***', 10, '2017-08-07 17:00:04', '2017-08-07 17:00:04', NULL),
(6, '1', '***REMOVED***', '***REMOVED***', '0', 5, '2017-07-29 12:58:34', NULL, NULL),
(10, '1', '***REMOVED***', '***REMOVED***', '***REMOVED***', 8, '2017-08-03 14:49:18', NULL, NULL),
(19, '4', '***REMOVED***', '***REMOVED***', '***REMOVED***', 11, '2017-08-07 17:05:41', '2017-08-07 17:05:41', NULL),
(20, '3', '***REMOVED***', '***REMOVED***', '***REMOVED***', 7, '2017-08-07 17:08:57', '2017-08-07 17:08:57', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `votes`
--

CREATE TABLE `votes` (
  `id` mediumint(9) NOT NULL COMMENT 'ID',
  `song_id` smallint(6) NOT NULL COMMENT '曲目ID',
  `vote` enum('-10','-5','0','5','10') NOT NULL COMMENT '投票',
  `voter` char(11) NOT NULL COMMENT '投票者学号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '最后更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投票';

--
-- 转存表中的数据 `votes`
--

INSERT INTO `votes` (`id`, `song_id`, `vote`, `voter`, `created_at`, `updated_at`) VALUES
(5, 2, '10', '***REMOVED***', '2017-07-28 09:02:37', NULL),
(6, 1, '-10', '***REMOVED***', '2017-07-28 09:03:59', NULL),
(7, 3, '10', '***REMOVED***', '2017-07-28 09:03:38', NULL),
(8, 1, '5', '***REMOVED***', '2017-07-31 12:34:17', NULL),
(9, 10, '10', '***REMOVED***', '2017-08-03 14:59:41', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`user_id`);

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
  MODIFY `id` smallint(9) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=12;
--
-- 使用表AUTO_INCREMENT `reports`
--
ALTER TABLE `reports`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=3;
--
-- 使用表AUTO_INCREMENT `songs`
--
ALTER TABLE `songs`
  MODIFY `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=23;
--
-- 使用表AUTO_INCREMENT `votes`
--
ALTER TABLE `votes`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

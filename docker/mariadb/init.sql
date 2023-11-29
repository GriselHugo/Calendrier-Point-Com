/* Créer une base de données */
CREATE DATABASE IF NOT EXISTS `cpc-db`;

/* Charger des données initiales */
USE `cpc-db`;

/* Créer une table "users" */
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/* Créer une table "todo" */
CREATE TABLE IF NOT EXISTS `todo` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `action` varchar(255) NOT NULL,
    `user_id` int(11) NOT NULL,
    `status` varchar(255) NOT NULL,
    `end_at` datetime NOT NULL,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
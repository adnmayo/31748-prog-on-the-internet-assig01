-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: uts_trip_tracking
-- ------------------------------------------------------
-- Server version	9.6.0

--
-- Temporary view structure for view `added_trips_view`
--

DROP TABLE IF EXISTS `added_trips_view`;
/*!50001 DROP VIEW IF EXISTS `added_trips_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `added_trips_view` AS SELECT 
 1 AS `airline_reference`,
 1 AS `origin_city`,
 1 AS `destination_city`,
 1 AS `date_of_departure`,
 1 AS `departure_time`,
 1 AS `seats_booked`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Australia',
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'Sydney','Australia'),(2,'Melbourne','Australia'),(3,'Brisbane','Australia'),(4,'Perth','Australia'),(5,'Adelaide','Australia'),(6,'Canberra','Australia'),(7,'Gold Coast','Australia'),(8,'Hobart','Australia');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `trip_id` int NOT NULL AUTO_INCREMENT,
  `airline_reference` varchar(30) NOT NULL,
  `origin_id` int NOT NULL,
  `destination_id` int NOT NULL,
  `departure_date` date NOT NULL,
  `departure_time` time NOT NULL,
  `seats_booked` int NOT NULL,
  PRIMARY KEY (`trip_id`),
  UNIQUE KEY `unique_airline_reference` (`airline_reference`),
  KEY `origin_id` (`origin_id`),
  KEY `destination_id` (`destination_id`),
  CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`origin_id`) REFERENCES `cities` (`city_id`),
  CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `cities` (`city_id`),
  CONSTRAINT `trips_chk_1` CHECK ((`origin_id` <> `destination_id`)),
  CONSTRAINT `trips_chk_2` CHECK ((`seats_booked` >= 1))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (11,'djjkee',3,4,'2026-04-25','08:30:00',32);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `added_trips_view`
--

/*!50001 DROP VIEW IF EXISTS `added_trips_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `added_trips_view` AS select `t`.`airline_reference` AS `airline_reference`,`c_origin`.`city_name` AS `origin_city`,`c_dest`.`city_name` AS `destination_city`,`t`.`departure_date` AS `date_of_departure`,`t`.`departure_time` AS `departure_time`,`t`.`seats_booked` AS `seats_booked` from ((`trips` `t` join `cities` `c_origin` on((`t`.`origin_id` = `c_origin`.`city_id`))) join `cities` `c_dest` on((`t`.`destination_id` = `c_dest`.`city_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

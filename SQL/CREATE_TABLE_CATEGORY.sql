CREATE TABLE Category(
   id_category Int Auto_Increment,
   label VARCHAR(20) NOT NULL,
   server_id VARCHAR(18) NOT NULL,
   PRIMARY KEY(id_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

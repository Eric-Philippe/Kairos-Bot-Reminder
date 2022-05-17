CREATE TABLE Reminder_Us(
   id_reminder Int Auto_Increment,
   c_date VARCHAR(23),
   t_date VARCHAR(23) NOT NULL,
   remind VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
   channel_id VARCHAR(18) NOT NULL,
   server_id VARCHAR(18) NOT NULL,
   notif VARCHAR(23),
   recurrence VARCHAR(18),
   category VARCHAR(18),
   PRIMARY KEY(id_reminder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

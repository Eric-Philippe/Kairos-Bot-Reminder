CREATE TABLE Reminder_Me(
   id_reminder Int Auto_Increment,
   c_date VARCHAR(23),
   t_date VARCHAR(23),
   remind VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
   id_user VARCHAR(18),
   recurrence VARCHAR(10),
   PRIMARY KEY(id_reminder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

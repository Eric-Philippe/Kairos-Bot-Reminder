CREATE TABLE Reminder_Us(
   id_reminder Int Auto_Increment,
   c_date TEXT,
   t_date TEXT,
   remind VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
   channel_id TEXT,
   server_id TEXT,
   notif TEXT,
   recurrence TEXT,
   PRIMARY KEY(id_reminder)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

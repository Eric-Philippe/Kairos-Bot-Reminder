CREATE TABLE Reminder_Us(
   id_reminder Int Auto_Increment,
   c_date TEXT,
   t_date TEXT,
   remind TEXT,
   channel_id TEXT,
   server_id TEXT,
   notif TEXT,
   recurrence TEXT,
   PRIMARY KEY(id_reminder)
);

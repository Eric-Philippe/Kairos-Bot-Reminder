CREATE TABLE Reminder_Us(
   id_reminder Int Auto_Increment,
   c_date TEXT,
   t_date TEXT,
   remind TEXT,
   channel_id TEXT,
   notif BOOLEAN,
   recurrence BOOLEAN,
   PRIMARY KEY(id_reminder)
);

CREATE TABLE Reminder(
   id_reminder Int Auto_Increment,
   c_date TEXT,
   t_date TEXT,
   remind TEXT,
   PRIMARY KEY(id_reminder)
);

CREATE TABLE Users(
   id_user VARCHAR(18),
   PRIMARY KEY(id_user)
);

CREATE TABLE Concerner(
   id_reminder INT Auto_Increment,
   id_user VARCHAR(18),
   PRIMARY KEY(id_reminder, id_user),
   FOREIGN KEY(id_reminder) REFERENCES Reminder(id_reminder),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);

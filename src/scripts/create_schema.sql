CREATE TABLE Country(
   CId VARCHAR(3),
   name VARCHAR(50) NOT NULL,
   gmtOffset DECIMAL(2,1) NOT NULL,
   PRIMARY KEY(CId)
);

CREATE TABLE RCategories(
   RCId CHAR(4),
   name VARCHAR(50) NOT NULL,
   parentId VARCHAR(50) NOT NULL,
   isGuild BOOLEAN NOT NULL,
   PRIMARY KEY(RCId)
);

CREATE TABLE Remindus(
   usId CHAR(5),
   channelId CHAR(18) NOT NULL,
   content VARCHAR(110) NOT NULL,
   entryDate DATETIME NOT NULL,
   targetDate DATETIME NOT NULL,
   description TEXT,
   repetition VARCHAR(50),
   mentionId VARCHAR(20),
   isPaused BOOLEAN NOT NULL,
   guildId VARCHAR(18) NOT NULL,
   RCId CHAR(4),
   PRIMARY KEY(usId),
   FOREIGN KEY(guildId) REFERENCES Guild(guildId),
   FOREIGN KEY(RCId) REFERENCES RCategories(RCId)
);

CREATE TABLE Guild(
   guildId VARCHAR(18),
   CId VARCHAR(3) NOT NULL,
   PRIMARY KEY(guildId),
   FOREIGN KEY(CId) REFERENCES Country(CId)
);


CREATE TABLE Utilisateur(
   userId CHAR(18),
   superAdmin BOOLEAN NOT NULL,
   CId VARCHAR(3) NOT NULL,
   PRIMARY KEY(userId),
   FOREIGN KEY(CId) REFERENCES Country(CId)
);

CREATE TABLE Remindme(
   meId CHAR(5),
   content CHAR(110) NOT NULL,
   description TEXT,
   entryDate DATETIME NOT NULL,
   targetDate DATETIME NOT NULL,
   repetition VARCHAR(50),
   isPaused BOOLEAN NOT NULL,
   RCId CHAR(4),
   userId CHAR(18) NOT NULL,
   PRIMARY KEY(meId),
   FOREIGN KEY(RCId) REFERENCES RCategories(RCId),
   FOREIGN KEY(userId) REFERENCES Utilisateur(userId)
);

CREATE TABLE TCategory(
   TCId CHAR(5),
   title VARCHAR(50) NOT NULL,
   userId CHAR(18) NOT NULL,
   PRIMARY KEY(TCId),
   FOREIGN KEY(userId) REFERENCES Utilisateur(userId)
);

CREATE TABLE Activity(
   AId CHAR(5),
   name VARCHAR(50) NOT NULL,
   TCId CHAR(5) NOT NULL,
   PRIMARY KEY(AId),
   FOREIGN KEY(TCId) REFERENCES TCategory(TCId)
);

CREATE TABLE Task(
   TId CHAR(5),
   content VARCHAR(50) NOT NULL,
   entryDate DATETIME NOT NULL,
   endDate DATETIME,
   TCId CHAR(5),
   AId CHAR(5),
   PRIMARY KEY(TId),
   FOREIGN KEY(TCId) REFERENCES TCategory(TCId),
   FOREIGN KEY(AId) REFERENCES Activity(AId)
);


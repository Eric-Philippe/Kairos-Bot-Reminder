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
   usId CHAR(4),
   guildId VARCHAR(50) NOT NULL,
   channelId CHAR(18) NOT NULL,
   content VARCHAR(110) NOT NULL,
   entryDate DATETIME NOT NULL,
   targetDate DATETIME NOT NULL,
   description TEXT,
   repetition VARCHAR(50),
   mentionId VARCHAR(20),
   isPaused BOOLEAN NOT NULL,
   RCId CHAR(4),
   PRIMARY KEY(usId),
   FOREIGN KEY(RCId) REFERENCES RCategories(RCId)
);

CREATE TABLE ACategories(
   ACId CHAR(4),
   name VARCHAR(50) NOT NULL,
   parentId VARCHAR(50) NOT NULL,
   PRIMARY KEY(ACId)
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

CREATE TABLE Activities(
   AId CHAR(5),
   name VARCHAR(50) NOT NULL,
   startDate DATETIME NOT NULL,
   endDate DATETIME,
   estimate TIME,
   isClosed BOOLEAN NOT NULL,
   userId CHAR(18) NOT NULL,
   ACId CHAR(4),
   PRIMARY KEY(AId),
   FOREIGN KEY(userId) REFERENCES Utilisateur(userId),
   FOREIGN KEY(ACId) REFERENCES ACategories(ACId)
);

CREATE TABLE Task(
   TId VARCHAR(5),
   name VARCHAR(50) NOT NULL,
   startDate DATETIME NOT NULL,
   endDate DATETIME,
   estimate TIME,
   isFinished BOOLEAN NOT NULL,
   AId CHAR(5) NOT NULL,
   PRIMARY KEY(TId),
   FOREIGN KEY(AId) REFERENCES Activities(AId)
);

CREATE TABLE Country(
   cId VARCHAR(3),
   name VARCHAR(50) NOT NULL,
   gmtOffset INT NOT NULL,
   PRIMARY KEY(cId)
);

CREATE TABLE RCategories(
   rId CHAR(4),
   name VARCHAR(50) NOT NULL,
   parentId VARCHAR(50) NOT NULL,
   isGuild LOGICAL NOT NULL,
   PRIMARY KEY(rId)
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
   isPaused LOGICAL NOT NULL,
   rId CHAR(4),
   PRIMARY KEY(usId),
   FOREIGN KEY(rId) REFERENCES RCategories(rId)
);

CREATE TABLE ACategories(
   rId CHAR(4),
   name VARCHAR(50) NOT NULL,
   parentId VARCHAR(50) NOT NULL,
   PRIMARY KEY(rId)
);

CREATE TABLE Utilisateur(
   userId CHAR(18),
   superAdmin LOGICAL NOT NULL,
   cId VARCHAR(3) NOT NULL,
   PRIMARY KEY(userId),
   FOREIGN KEY(cId) REFERENCES Country(cId)
);

CREATE TABLE Remindme(
   meId CHAR(5),
   content CHAR(110) NOT NULL,
   description TEXT,
   entryDate DATETIME NOT NULL,
   targetDate DATETIME NOT NULL,
   repetition VARCHAR(50),
   isPaused LOGICAL NOT NULL,
   rId CHAR(4),
   userId CHAR(18) NOT NULL,
   PRIMARY KEY(meId),
   FOREIGN KEY(rId) REFERENCES RCategories(rId),
   FOREIGN KEY(userId) REFERENCES Utilisateur(userId)
);

CREATE TABLE Activities(
   AId CHAR(5),
   name VARCHAR(50) NOT NULL,
   startDate DATETIME NOT NULL,
   endDate DATETIME,
   estimate TIME,
   isClosed LOGICAL NOT NULL,
   userId CHAR(18) NOT NULL,
   rId CHAR(4),
   PRIMARY KEY(AId),
   FOREIGN KEY(userId) REFERENCES Utilisateur(userId),
   FOREIGN KEY(rId) REFERENCES ACategories(rId)
);

CREATE TABLE Task(
   id VARCHAR(5),
   name VARCHAR(50) NOT NULL,
   startDate DATETIME NOT NULL,
   endDate DATETIME,
   estimate TIME,
   isFinished LOGICAL NOT NULL,
   AId CHAR(5) NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(AId) REFERENCES Activities(AId)
);

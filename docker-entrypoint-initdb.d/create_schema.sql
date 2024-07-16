CREATE TABLE Country(
   CId VARCHAR(3),
   name VARCHAR(50) NOT NULL,
   gmtOffset DECIMAL(3,1) NOT NULL,
   PRIMARY KEY(CId)
);

CREATE TABLE RCategories(
   RCId CHAR(4),
   name VARCHAR(50) NOT NULL,
   parentId VARCHAR(50) NOT NULL,
   isGuild BOOLEAN NOT NULL,
   PRIMARY KEY(RCId)
);

CREATE TABLE Guild(
   guildId VARCHAR(18),
   CId VARCHAR(3) NOT NULL,
   PRIMARY KEY(guildId),
   FOREIGN KEY(CId) REFERENCES Country(CId)
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

INSERT INTO Country (CId, name, gmtOffset) VALUES
    ('#00', 'International Date Line West', -12.0),
    ('#01', 'Midway Island, Samoa', -11.0),
    ('#02', 'Hawaii', -10.0),
    ('#03', 'Alaska', -9.0),
    ('#04', 'Pacific Time (US & Canada)', -8.0),
    ('#05', 'Mountain Time (US & Canada)', -7.0),
    ('#06', 'Central Time (US & Canada), Mexico City', -6.0),
    ('#07', 'Eastern Time (US & Canada), Bogota, Lima', -5.0),
    ('#08', 'Atlantic Time (Canada), Caracas, La Paz', -4.0),
    ('#09', 'Newfoundland', -3.5),
    ('#10', 'Brazil, Buenos Aires, Georgetown', -3.0),
    ('#11', 'Mid-Atlantic', -2.0),
    ('#12', 'Azores, Cape Verde Islands', -1.0),
    ('#13', 'Western Europe Time, London, Lisbon, Casablanca', 0.0),
    ('#14', 'Brussels, Copenhagen, Madrid, Paris', 1.0),
    ('#15', 'Kaliningrad, South Africa', 2.0),
    ('#16', 'Baghdad, Riyadh, Moscow, St. Petersburg', 3.0),
    ('#17', 'Tehran', 3.5),
    ('#18', 'Abu Dhabi, Muscat, Baku, Tbilisi', 4.0),
    ('#19', 'Kabul', 4.5),
    ('#20', 'Ekaterinburg, Islamabad, Karachi, Tashkent', 5.0),
    ('#21', 'Bombay, Calcutta, Madras, New Delhi', 5.5),
    ('#22', 'Kathmandu', 5.75),
    ('#23', 'Almaty, Dhaka, Colombo', 6.0),
    ('#24', 'Yangon, Bangkok, Hanoi, Jakarta', 6.5),
    ('#25', 'Bangkok, Hanoi, Jakarta', 7.0),
    ('#26', 'Beijing, Perth, Singapore, Hong Kong', 8.0),
    ('#27', 'Tokyo, Seoul, Osaka, Sapporo, Yakutsk', 9.0),
    ('#28', 'Darwin', 9.5),
    ('#29', 'Eastern Australia, Guam, Vladivostok', 10.0),
    ('#30', 'Magadan, Solomon Islands, New Caledonia', 11.0),
    ('#31', 'Auckland, Wellington, Fiji, Kamchatka', 12.0);

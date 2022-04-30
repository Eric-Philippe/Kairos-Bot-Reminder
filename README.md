# Reminder Discord Bot | Kairos#9720

<img src="https://media.discordapp.net/attachments/579303130886569984/969848226880569364/unknown.png"
style="border-radius:20px; width: 30%; margin-left: 5%; box-shadow: 7px 5px 5px rgb(0, 0, 255, .2);"
alt="Main Display of the Bot" />

This project is a Reminder Discord bot. It is coded in NodeJS and also in SQL (mysql)

---

Table of Contents

1. [Open Source](#open_source)
2. [Features](#features)
3. [Quick Example](#quick_example)
4. [Add It on your Discord Server !](#add_bot)
5. [License](#license)
6. [Thanks](#thanks)

---

<div id='open_source'/>

## Bot Open Source

> - Feel free to use this code with your own bots and edit the code as you wish !
> - This Bot is made in order to be used in more than one Discord server, you can invite it with that [link](https://discord.com/oauth2/authorize?client_id=955923021732913254&permissions=414666189889&scope=bot)
> - The bot is still evolving, currently in its second version following a major overhaul

---

<div id='features' />

## Features

The bot is made with the following features :
A whole RemindMe system wich allows you to set reminders for yourself
A RemindUs system wich allows you to set reminders for your servers !
And a category system wich allows you to set categories for your remindUs !
You can also put a recurrence for each reminder, they will automatically be setted ! They can be Daily, Weekly, Monthly or Yearly !

<br/>

### Examples

<br/>

> !help

It will send you the list of commands

<img src="https://cdn.discordapp.com/attachments/579303130886569984/969856220729077800/unknown.png"
style="width: 30%;"
alt="Help Command">

<br/>

> !reminUs 13/05/2023 10:00 My Own Birthday !

It will send you a notification at the given date with the given message !

<img src="https://cdn.discordapp.com/attachments/579303130886569984/969852894755045376/unknown.png"
style="width: 40%;"
alt="Reminder Notification"/>

<br/>

> !remindUs

It will open a menu where you can set reminders for your server !

<img src="https://cdn.discordapp.com/attachments/579303130886569984/969854641338728448/unknown.png"
style="width: 40%;"
alt="RemindUs Menu" />

---

<div id='quick_example' />

## Quick Example

```js
index.js;

const { client } = require("./utils/client"); // Discord Bot
const { con } = require("./utils/mysql"); // SQL Connexion

const { TOKEN } = require("./config.json"); // Token

const Reminder = require("./remindMe"); // Reminder Class
```

You'll need to add a config.json file as well as a mysql.json file with the following lines

```json
config.json

{
  "TOKEN": "YOUR_TOKEN_HERE"
}
```

```json
mysql.json

{
  "SQL_Option": {
    "host": "HOST_IP",
    "port": "HOST_PORT",
    "user": "USERNAME_OF_THE_DB",
    "password": "PASSWORD_OF_THE_DB",
    "database": "DB_TO_WORK_WITH"
  }
}
```

---

<div id='add_bot' />

## Add the Bot on your server !

Feel free to add the Discord Bot on your own server ! Just click on that [link](https://discord.com/oauth2/authorize?client_id=955923021732913254&permissions=414666189889&scope=bot) and [authorize](https://cdn.discordapp.com/attachments/739553949199106158/956552088454832128/Capture_decran_2022-03-24_145317.png) the bot to join your server !

---

<div id='license' />

## License !

This Discord Bot is licensed under the GPL 3.0 license. See the file `LICENSE` for more information. If you plan to use any part of this source code in your own bot, I would be grateful if you would include some form of credit somewhere.

---

<div id='thanks'/>

## Thanks

> Thanks for checking out the ReadMe !
> Contact Sunrise#1318 If you need anything !

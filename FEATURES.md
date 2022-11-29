# Kairos Refactor

## Legend

### Slash Commands

- <> - Facultative
- [] - Obligatory
- \` \` - SubCommand

---

## Country Settings

### Slash Commands

\_\_

#### /country ['server' | 'me']

`Set the country of the server or the user`

### ~~Country Available at first~~

### All the timezone are available !

Every timezone are here and working

FR Will be the default country for every case scenario

---

## RemindMe

### Slash Commands

\_\_

### /rm

rm is a quick command to add a Reminder for yourself, useful when you want to remind yourself something quickly

\_\_

#### /rm [Time] [Raw-Date] [Message]

##### _Ex: /rm 8:00 27/12 Birthday_

\_

#### /rm [Args] [Today, Tomorrow, Next Week, Next Month] [Time] [Message]

##### _Ex: /rm today 8:00 Birthday_

\_\_

#### /remindme \``set`\` [Time] [Date] [Message] <Description> <Repetition> <Category>

`Create a new self reminder`

_Default if no value_ :

- Date : Today
- Month : Current Month
- Year : Current Year

\_\_

#### /remindme \``delete`\` ["Reminder ID"]

`Delete a self reminder`

\_\_

#### /remindme \``break`\` ["Reminder ID"]

`Break a self reminder but keep it in the database`

\_\_

#### /remindme \``restart`\` ["Reminder ID"]

`Restart a broken self reminder`

\_\_

#### /remindme \``list`\`

`List all self reminders`

---

## RemindUs

---

## TimeLogger

### Slash Commands

\_\_

#### /startWork ["activity"] <"Task">

`Démarre un chronomètre qui enregistre le temps passé sur une tâche.`

\_\_

#### /stopWork ["activity"] <"Task">

`Arrête le chronomètre et enregistre le temps passé sur une tâche.`

\_\_

#### /doneTime ["activity"] <"Task"> [Temps passé Heure(s)] [Temps passé Minute(s)]

`Enregistre manuellement le temps passé sur une tâche.`

\_\_

#### /displayTime <"Activity" || "Task">

`Voir temps passé par activité et par tâche en overall.`

\_\_

##### /displayTime 'period' [Date1] [Date2]

`Affiche l'overall de toutes les tâches entre deux dates.`

\_\_

#### /displayActivties

`Affiche les activités enregistrées.`

---

## Help

Check journalier de serveur s'ils sont toujours disponibles sinont les supprimer et clear la db

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

\_\_

#### /country-propose ['Language' | 'Currency' | 'Timezone']

`Propose a new language, currency or timezone`

### Country Available at first (With the default timezones)

- [FR] **France** (Europe/Paris) (French)
- [US-E] **United States East** (America/New_York) (English)
- [US-W] **United States West** (America/Los_Angeles) (English)
- [US-C] **United States Central** (America/Chicago) (English)
- [UK] **United Kingdom** (Europe/London) (English)

FR Will be the default country for every case scenario

---

## RemindMe

### Slash Commands

\_\_

### /rm

\_\_

#### /rm [All Args Dumped]

##### _Ex: /rm 8:00 27/12 Birthday_

\_

#### /rm [Args] [Today, Tomorrow, Next Week, Next Month] [Time] [Message]

##### _Ex: /rm today 8:00 Birthday_

\_\_

#### /remindme \``add`\` ["Remind Reason"] ["HH"] ["MM"] <"DD"> <"MM"> <"YYYY">

`Create a new self reminder`

_Default if no value_ :

- Date : Today
- Month : Current Month
- Year : Current Year

\_\_

#### /remindme \``create`\`

`Launch the process to create a new self reminder with more options (Repeating (Choose day, Month), Categories, Description etc...)`

\_\_

#### /remindme \``delete`\` ["Reminder ID"]

`Delete a self reminder`

\_\_

#### /remindme \``clear`\`

`Clear all self reminders`

\_\_

#### /remindme \``break`\` ["Reminder ID"]

`Break a self reminder but keep it in the database`

\_\_

#### /remindme \``unbreak`\` ["Reminder ID"]

`Unbreak a self reminder`

\_\_

#### /remindme \``list`\`

`List all self reminders`

---

### Slash Commands

### Quick Command

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

Code Remindme

\#AA11

Code Remindus

\#A123

SELECT U.id_user
FROM Users as U, Reminder as R, Concerner as C
WHERE U.id_user = C.id_user
AND C.id_reminder = R.id_reminder
AND R.id_reminder =?;

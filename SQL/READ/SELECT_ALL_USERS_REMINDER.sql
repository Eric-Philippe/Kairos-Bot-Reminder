SELECT R.id_reminder, R.t_date, R.c_date, R.remind
FROM Users as U, Reminder as R, Concerner as C
WHERE R.id_reminder = C.id_reminder
AND C.id_user = U.id_user
AND U.id_user =?
ORDER BY R.t_date;

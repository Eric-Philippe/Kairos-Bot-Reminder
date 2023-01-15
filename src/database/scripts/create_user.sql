/**
 * Feel free to change the username as well as the password given to it
 */
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';

/* In an ideal world, we should strictly provide the grants the API has access 
 * to a specific table rather than all the privileges.
 */
GRANT ALL PRIVILEGES TO 'user'@'localhost';

flush privileges;
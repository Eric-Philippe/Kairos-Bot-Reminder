CREATE PROCEDURE execute_immediate(IN query MEDIUMTEXT)
	MODIFIES SQL DATA
	SQL SECURITY DEFINER
BEGIN
	SET @q = query;
	PREPARE stmt FROM @q;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END

CREATE PROCEDURE clearTimeLogTable ()
    BEGIN
        -- TCategory = (TCId CHAR(5), title VARCHAR(50), #userId);
        -- Activity = (AId CHAR(5), name VARCHAR(50), #TCId);
        -- Task = (TId CHAR(5), content VARCHAR(50), entryDate DATETIME, endDate DATETIME, #TCId*, #AId*);
        CALL execute_immediate('DELETE FROM Task');
        CALL execute_immediate('DELETE FROM Activity');
        -- Delete all the categories except the default one (title = "Miscellaneous")
       CALL execute_immediate('DELETE FROM TCategory WHERE title <> 'Miscellaneous'');
    END;
    /

DELETE FROM Task;
DELETE FROM Activity;
DELETE FROM TCategory WHERE title <> 'Miscellaneous';
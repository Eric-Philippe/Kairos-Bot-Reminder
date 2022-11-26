export const IdentifiantQueries = {
  GetACategories: `
    SELECT
    ACId
    FROM
    ACategories;
    `,
  GetActivities: `
    SELECT
    AId
    FROM
    Activities;
    `,
  GetCountry: `
    SELECT
    CId
    FROM
    Country;
    `,
  GetRCategories: `
    SELECT
    RCId
    FROM
    RCategories;
    `,
  GetRemindme: `
    SELECT
    meId
    FROM
    Remindme;
    `,
  GetRemindus: `
    SELECT
    usId
    FROM
    Remindus;
    `,
  GetTask: `
    SELECT
    TId
    FROM
    Task;
    `,
};

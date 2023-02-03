export const IdentifiantQueries = {
  GetTCategories: `
    SELECT
    TCId
    FROM
    TCategory;
    `,
  GetActivities: `
    SELECT
    AId
    FROM
    Activity;
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

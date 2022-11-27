export const Repetition = {
  DAILY: {
    name: "Daily",
    value: "DAILY",
    nextDate: (date: Date) => {
      return new Date(date.setDate(date.getDate() + 1));
    },
  },
  DAILY_EXCEPT_WEEKENDS: {
    name: "Daily Except Weekends",
    value: "DAILY_EXCEPT_WEEKENDS",
    nextDate: (date: Date) => {
      if (date.getDay() === 5) {
        return new Date(date.setDate(date.getDate() + 3));
      } else {
        return new Date(date.setDate(date.getDate() + 1));
      }
    },
  },
  WEEKLY: {
    name: "Weekly",
    value: "WEEKLY",
    nextDate: (date: Date) => {
      return new Date(date.setDate(date.getDate() + 7));
    },
  },
  MONTHLY: {
    name: "Monthly",
    value: "MONTHLY",
    nextDate: (date: Date) => {
      return new Date(date.setMonth(date.getMonth() + 1));
    },
  },
  YEARLY: {
    name: "Yearly",
    value: "YEARLY",
    nextDate: (date: Date) => {
      return new Date(date.setFullYear(date.getFullYear() + 1));
    },
  },
};

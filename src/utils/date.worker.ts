export default class DateWorker {
  /**
   * Returns a date to a human readable string
   * @param date
   * @example 2021-01-01 00:00:00 -> 1st January 2021 at 00:00:00
   */
  public static dateToReadable(date: Date): string {
    let finalDate = date.toLocaleDateString("en-GB");
    let finalTime = date.toLocaleTimeString();
    // Remove the seconds from the time
    finalTime = finalTime.substring(0, finalTime.length - 3);
    // Concatenate the date and time
    finalDate = finalDate + " at " + finalTime;
    return finalDate;
  }
  /**
   * Returns all the months between two optional dates by default 1 (January) and 12 (December)
   * @param firstDate
   * @param secondDate
   * @returns Array of months
   */
  public static getMonths(
    firstDate?: number,
    secondDate?: number
  ): Array<string> {
    if (!firstDate) firstDate = 1;
    if (!secondDate) secondDate = 12;
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let finalMonths = [];
    for (let i = firstDate - 1; i < secondDate; i++) {
      finalMonths.push(months[i]);
    }
    return finalMonths;
  }
  /**
   * Returns a readable string with a given time in minutes
   * Ex: 60 -> 1h
   * Ex: 90 -> 1h 30m
   * Ex: 10 -> 10m
   * @param time
   */
  public static timeToReadable(time: number | null): string {
    if (!time || time == null || time < 0) return "0m";
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    let finalTime = "";
    if (hours > 0) finalTime += hours + "h ";
    if (minutes > 0) finalTime += minutes + "m";
    if (finalTime.endsWith("h "))
      finalTime = finalTime.substring(0, finalTime.length - 1);
    return finalTime;
  }
  public static stringToDate(
    date: string | null,
    endOfDay: boolean = false
  ): Date {
    if (!date || date.split("/").length == 0) return new Date();

    // Invert the date and the month
    if (date.split("/").length == 2) {
      date =
        date.split("/")[0] +
        "/" +
        date.split("/")[1] +
        "/" +
        new Date().getFullYear();
    }

    if (!endOfDay)
      date =
        date.split("/")[1] +
        "/" +
        date.split("/")[0] +
        "/" +
        date.split("/")[2];
    else
      date =
        date.split("/")[1] +
        "/" +
        date.split("/")[0] +
        "/" +
        date.split("/")[2] +
        " 23:59:59";
    return new Date(date);
  }
  public static getDateDifferentM(inDate: Date, ouDate: Date): number {
    // Get the difference in minute between the two given date
    let diff = ouDate.getTime() - inDate.getTime();
    let diffM = Math.floor(diff / 1000 / 60);
    return diffM;
  }

  public static calculTime(
    hours: number,
    minutes: number,
    operation: string,
    hoursB: number,
    minutesB: number,
    format: string // If hm, basic addition, if m, result in minutes, if 24, result in 24h format if necessary count days
  ) {
    let total_minutesA = hours * 60 + minutes;
    let total_minutesB = hoursB * 60 + minutesB;
    let result: number;
    switch (operation) {
      case "sum":
        result = total_minutesA + total_minutesB;
        break;
      case "diff":
        result = total_minutesA - total_minutesB;
        break;
      default:
        result = total_minutesA + total_minutesB;
    }
    let resultString = "";
    switch (format) {
      case "hm":
        let hours = Math.floor(result / 60);
        let minutes = result % 60;
        resultString = hours + "h " + minutes + "m";
        break;
      case "m":
        resultString = result + "m";
        break;
      case "24":
        let days = Math.floor(result / 60 / 24);
        let hoursBis = Math.floor(result / 60) - days * 24;
        let minutesBis = result % 60;
        resultString = days + "d " + hoursBis + "h " + minutesBis + "m";
        break;
    }
    return resultString;
  }

  public static dateToMySQL(date: Date): string {
    // We want a JS date to be like 2021-01-01 00:00:00
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let finalDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return finalDate;
  }
}

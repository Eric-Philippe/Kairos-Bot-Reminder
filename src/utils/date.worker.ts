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
  public static timeToReadable(time: number): string {
    if (!time || time == null || time < 0) return "0m";
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    let finalTime = "";
    if (hours > 0) finalTime += hours + "h ";
    if (minutes > 0) finalTime += minutes + "m";
    return finalTime;
  }
}

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
  ): Array<String> {
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
}

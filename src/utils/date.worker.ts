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
}

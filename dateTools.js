/**
 * Build the time left counter with white and black emotes
 * @param {Date} targetDate
 * @return {String}
 */
const buildTimeLeft = function (targetDate, launchDate) {
  let emotes = ["⬜", "⬛"]; // Default Emote
  let currentDateMi = new Date().getTime(); // Current Date in milliseconde
  let target_dateMi = targetDate.getTime(); // Target reminder date in milliseconde
  let launch_dateMi = launchDate.getTime(); // Launch reminder date in milliseconde

  let total_time = target_dateMi - launch_dateMi; // Time beteween the target and launch date
  let elasped_time = currentDateMi - launch_dateMi; // Time elapsed between the current and launch date
  let produit_croix = (elasped_time * 10) / total_time; // Find the number of white square needed
  Math.round(produit_croix); // Need an integer
  if (produit_croix == 10) produit_croix = 9;

  let finalText = ""; // Empty text
  let emotesLeft = 10 - produit_croix; // Black emotes

  // White squares
  for (let i = 1; i <= produit_croix; i++) {
    finalText = finalText + emotes[0];
  }
  // Black squares
  for (let i = 1; i <= emotesLeft; i++) {
    finalText = finalText + emotes[1];
  }
  // Return the final text
  return finalText;
};
/**
 * [EN] date to [FR] date
 * @param {Date} d
 */
const dateToString = function (d) {
  let month = d.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let finalText = d.getDate() + "/" + month + "/" + d.getFullYear() + " "; // [First] - 01/01/1999
  // Definition of the hours and minutes
  let hours = d.getHours();
  let minutes = d.getMinutes();
  // If the hours and minutes are less than 0, require a 0 before
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  // Add the hour to the final String
  finalText = finalText + hours + "h" + minutes;
  // Return the final text
  return finalText;
};
/**
 * Convert the time left in ms into a valid String
 * @param {Number} target_mi
 * @return {String} Time Left
 */
const timeLeft = function (target_mi) {
  let current_mi = new Date().getTime(); // Current time in ms
  let different = new Date().getTimezoneOffset(); // Difference with the TimeZoneOffSet in ms

  let left_s = target_mi - current_mi; // Time left between the target time and the current time
  left_s = left_s + different * 60 * 1000; // Add the difference at the final time left and put it in second

  let textTimeLeft = left_s + "s"; // Convert into String

  // If Time Left is greater than a week
  if (left_s >= 6.048 * 10 ** 8) {
    // Format for weeks remaining
    textTimeLeft =
      " " +
      Math.round((left_s / (6.048 * 10 ** 8)) * 10) / 10 +
      " week(s) remaining";
    // If the time if greater than a day
  } else if (left_s >= 8.64 * 10 ** 7) {
    // Format for days remaining
    textTimeLeft =
      " " +
      Math.round((left_s / (8.64 * 10 ** 7)) * 10) / 10 +
      " day(s) remaining";
  } else {
    // Create a new date Object witg the time left
    let d = new Date(left_s);
    // " 00h00min00sec remaining"
    textTimeLeft =
      " " +
      d.getHours() +
      " h " +
      d.getMinutes() +
      " min " +
      d.getSeconds() +
      " sec remaining";
  }
  // Return the final Text
  return textTimeLeft;
};

// EXPORTS
exports.buildTimeLeft = buildTimeLeft;
exports.dateToString = dateToString;
exports.timeLeft = timeLeft;

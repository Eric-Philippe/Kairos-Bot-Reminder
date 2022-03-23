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

  let total_time = target_dateMi - launch_dateMi; // Time beteween, the target and launch date
  let elasped_time = currentDateMi - launch_dateMi; // Time elapsed between the current and launch date
  let produit_croix = (elasped_time * 10) / total_time; // Find the number of white square needed
  Math.round(produit_croix); // Need an integer
  if (produit_croix == 10) produit_croix = 9;

  let finalText = ""; // Empty text
  let emotesLeft = 10 - produit_croix; // Black emotes

  // White squares
  for (let i = 1; i < produit_croix; i++) {
    finalText = finalText + emotes[0];
  }
  // Black squares
  for (let i = 1; i < emotesLeft; i++) {
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
  let finalText = // [First] - 01/01/1999
    d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " ";

  let hours = d.getHours();
  let minutes = d.getMinutes();

  // Add the additional zero to the
  if (hours === "0") hours = "00";
  if (minutes === "0") minutes = "00";

  finalText = finalText + hours + "h" + minutes;

  return finalText;
};

const timeLeft = function (target_mi) {
  let current_mi = new Date().getTime();
  let different = new Date().getTimezoneOffset();
  let left_s = target_mi - current_mi;
  left_s = left_s + different * 60 * 1000;
  let textTimeLeft = left_s + "s";
  if (left_s >= 6.048 * 10 ** 8) {
    textTimeLeft =
      " " +
      Math.round((left_s / (6.048 * 10 ** 8)) * 10) / 10 +
      " week(s) remaining";
  } else if (left_s >= 8.64 * 10 ** 7) {
    textTimeLeft =
      " " +
      Math.round((left_s / (8.64 * 10 ** 7)) * 10) / 10 +
      " day(s) remaining";
  } else {
    let d = new Date(left_s);
    textTimeLeft =
      " " +
      d.getHours() +
      " h " +
      d.getMinutes() +
      " min " +
      d.getSeconds() +
      " sec remaining";
  }

  return textTimeLeft;
};

exports.buildTimeLeft = buildTimeLeft;
exports.dateToString = dateToString;
exports.timeLeft = timeLeft;

/**
 * Format a date for display.
 * @param {Date} date - Date object.
 * @param {string} timezone - Selected  timezone ("local" or "utc").
 * @param {string} timeFormat - Desired time format ("12" or "24").
 * @returns {string} - Date for display (e.g., Wed Sep 28 2022 2:00 PM EDT).
 */
export function formatDateTime(date, timezone, timeFormat) {
  let dow, month, day, year, time;
  if (timezone == "local") {
    [dow, month, day, year, time] = date.toString().split(" ");
  } else {
    [dow, day, month, year, time] = date.toUTCString().split(" ");
    dow = dow.replace(/,/g, "");
  }
  return [
    dow,
    month,
    day,
    year,
    formatTime(time, timeFormat),
    getDisplayTimezone(timezone)
  ].join(" ");
}

/**
 * Format a time for display.
 * @param {string} timeStr - Time string in the format HH:MM:SS.
 * @param {string} timeFormat - Desired time format ("12" or "24").
 * @returns {string} - Time string in the desired format.
 */
export function formatTime(timeStr, timeFormat = "12") {
  let [hour, minute] = timeStr.split(":").slice(0, 2);
  if (timeFormat === "24") return `${hour}:${minute}`;
  hour = parseInt(hour, 10);
  let ampm = "AM";
  if (hour > 11) {
    ampm = "PM";
    if (hour > 12) hour = hour - 12;
  }
  if (hour === 0) hour = "12";
  return `${hour}:${minute} ${ampm}`;
}

/**
 * Format the selected timezone for display.
 * @param {string} timezone - Selected  timezone ("local" or "utc").
 * @returns {string} -  Display timezone abbreviation.
 */
export function getDisplayTimezone(timezone) {
  return timezone === "local" ? getLocalTimezoneAbbreviation() : "UTC";
}

/**
 * Get the abbreviation for the user's timezone.
 * @returns {string} - Timezone abbreviation.
 */
export function getLocalTimezoneAbbreviation() {
  return new Date()
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
}

/**
 * Get the date from a storm track point feature.
 * @param {Object} feature - Track point feature GeoJSON.
 * @returns {Date}
 */
export function getTrackPointDate(feature) {
  return new Date(`${feature.properties.time_utc}Z`);
}

/**
 * Offset a date based on the selected timezone.
 * @param {Date} date - Date in UTC.
 * @param {string} timezone - Selected timezone ("local" or "utc").
 * @returns {Date}
 */
export function offsetDate(date, timezone) {
  return timezone === "utc"
    ? new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    : date;
}

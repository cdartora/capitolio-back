import { google } from "googleapis";
import { JWT } from "google-auth-library";
import key from "./credentials.json";
import { parseDateTime } from "./utils.js";

const createEvent = async (event) => {
  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  const calendar = google.calendar({ version: "v3" });

  try {
    const res = await calendar.events.insert({
      calendarId:
        "8c55160443cc8f50c68ce39c0433ec95ca687df0ac0278dcd003f1f7b6032bac@group.calendar.google.com",
      auth: client,
      requestBody: event,
    });
    return res.data.htmlLink;
  } catch (error) {
    throw new Error(`Could not create event: ${error.message}`);
  }
};

const createEventData = ({ title, movieDate, timings, description }) => ({
  summary: title,
  start: {
    dateTime: parseDateTime(movieDate, timings, true), // Adjust to match your data format
    timeZone: "America/Sao_Paulo",
  },
  end: {
    dateTime: parseDateTime(movieDate, timings, false),
    timeZone: "America/Sao_Paulo",
  },
  description,
  location: "Cinemateca Capitólio",
});

module.exports = { createEvent, createEventData };

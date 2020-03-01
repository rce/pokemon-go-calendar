const express = require("express")
const events = require("./events.js")

const app = express()

app.get("/events.ics", (req, res) => {
  writeField(res, "BEGIN", "VCALENDAR")
  writeField(res, "VERSION", "2.0")
  writeField(res, "PRODID", "-//github.com/rce//Pokemon GO Events V1.0//EN")
  writeField(res, "X-WR-CALNAME", "Pokemon GO Event Calendar")
  events.forEach(event => writeEvent(res, event))
  writeField(res, "END", "VCALENDAR")
  res.end()
})

function writeEvent(res, event) {
  writeField(res, "BEGIN", "VEVENT")
  writeField(res, "UID", event.id)
  writeField(res, "DTSTAMP", event.created)
  writeField(res, "DTSTART", event.start)
  writeField(res, "DTEND", event.end)
  writeField(res, "SUMMARY", event.title)
  writeField(res, "DESCRIPTION", event.title)
  writeField(res, "CLASS", "PUBLIC")
  writeField(res, "END", "VEVENT")
}

function writeField(res, key, value) {
  res.write(key + ":" + value + "\r\n")
}

module.exports = app

const express = require("express")
const events = require("./events.js")

const { IANAZone } = require("luxon")

const contentType = process.env.CONTENT_TYPE || "text/plain"

const app = express()

app.get("/events.ics", (req, res) => {
  const zone = IANAZone.create(req.query.tz)
  if (!zone.valid) {
    res.status(400).send("Bad Request")
    return
  }

  res.append('Content-Type', contentType)

  writeField(res, "BEGIN", "VCALENDAR")
  writeField(res, "VERSION", "2.0")
  writeField(res, "PRODID", "-//github.com/rce//Pokemon GO Events V1.0//EN")
  writeField(res, "X-WR-CALNAME", "Pokemon GO Event Calendar")
  events.forEach(event => writeEvent(res, event, zone))
  writeField(res, "END", "VCALENDAR")
  res.end()
})

function writeEvent(res, event, zone) {
  const mkStamp = dt =>
    formatCalendarTimestamp(dt.setZone(zone, {
      keepLocalTime: event.localTime
    }))

  writeField(res, "BEGIN", "VEVENT")
  writeField(res, "UID", event.id)
  writeField(res, "DTSTAMP", "19700101T000000Z")
  writeField(res, "DTSTART", mkStamp(event.start))
  writeField(res, "DTEND", mkStamp(event.end))
  writeField(res, "SUMMARY", event.title)
  writeField(res, "DESCRIPTION", event.title)
  writeField(res, "CLASS", "PUBLIC")
  writeField(res, "END", "VEVENT")
}

function writeField(res, key, value) {
  res.write(key + ":" + value + "\r\n")
}

function formatCalendarTimestamp(dt) {
  const utc = dt.toUTC()
  return utc.toFormat("yyyyMMdd") + "T" + utc.toFormat("HHmm00") + "Z"
}

module.exports = app

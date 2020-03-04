const { DateTime, IANAZone } = require("luxon")

const pokemonGoTimeZone = IANAZone.create("UTC")

module.exports = [
  {
    id: "pokemon-day-raid-day-2020",
    title: "Pokémon Day Raid Day 2020",
    start: parseTime("2020-03-01 14:00"),
    end: parseTime("2020-03-01 17:00"),
    localTime: true,
  },
  {
    id: "pokemon-spotlight-hour",
    title: "Pokémon Spotlight Hour",
    start: parseTime("2020-03-03 18:00"),
    end: parseTime("2020-03-03 19:00"),
    localTime: true,
  },
  {
    id: "mystery-bonus-hour",
    title: "Mystery Bonus Hour",
    start: parseTime("2020-03-05 18:00"),
    end: parseTime("2020-03-05 19:00"),
    localTime: true,
  },
  {
    id: "darkrai-special-raid-weekend",
    title: "Darkrai Special Raid Weekend",
    start: parseTime("2020-03-06 08:00"),
    end: parseTime("2020-03-09 22:00"),
    localTime: true,
  },
  {
    id: "go-rocket-global-takeover",
    title: "GO Rocket Global Takeover",
    start: parseTime("2020-03-07 14:00"),
    end: parseTime("2020-03-07 17:00"),
    localTime: true,
  },
  {
    id: "2020-abra-community-day",
    title: "Abra Community Day",
    start: parseTime("2020-03-15 11:00"),
    end: parseTime("2020-03-15 14:00"),
    localTime: true,
  },
]

function parseTime(text) {
  return DateTime.fromFormat(text, "yyyy-MM-dd HH:mm", {
    setZone: pokemonGoTimeZone,
  })
}

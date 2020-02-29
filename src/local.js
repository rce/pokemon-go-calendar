const app = require("./app.js")

async function main() {
  app.listen(3000, () => console.log("Listening on port 3000"))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

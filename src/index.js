const awsServerlessExpress = require("aws-serverless-express")
const express = require("express")

const app = express()

app.get('/', (req, res) => {
  res.json({ hello: "World" })
})

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}

const awsServerlessExpress = require("aws-serverless-express")
const app = require("./app.js")

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}

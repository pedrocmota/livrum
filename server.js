const {createServer} = require('https')
const {parse} = require('url')
const next = require('next')
const fs = require('fs')

const app = next({
  dev: process.env.npm_lifecycle_event === 'dev'
})
const handle = app.getRequestHandler()

if (!fs.existsSync('.env')) {
  throw 'The .env file does not exist. Check if ".env.example" has been renamed to ".env"'
}

app.prepare().then(() => {
  const httpsOptions = {
    key: fs.readFileSync(`./certificates/${process.env.SERVER_PRIVATE_KEY}`),
    cert: fs.readFileSync(`./certificates/${process.env.SERVER_CERTIFICATE}`)
  }
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(parseInt(process.env.SERVER_PORT), (err) => {
    if (err) throw err
    console.log(`>> Server started on ${process.env.SERVER_URI}:${process.env.SERVER_PORT}`)
  })
})
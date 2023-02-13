const authrite = require('authrite-express')
const PacketPay = require('@packetpay/express')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4004
const TEST_SERVER_PRIVATE_KEY = 
'5ad26fee0a367fb8dea21b39631985ba0a07bb5206d4ff3e8bd8fa478246b071'
const TEST_SERVER_BASEURL = `http://localhost:${port}`

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Before any PacketPay middleware, set up the server for Authrite
app.use(authrite.middleware({
    serverPrivateKey: TEST_SERVER_PRIVATE_KEY,
    baseUrl: TEST_SERVER_BASEURL
}))

// Configure the express server to use the PacketPay middleware
app.use(PacketPay({
    serverPrivateKey: TEST_SERVER_PRIVATE_KEY,
    ninjaConfig: {
      // Use the Babbage staging testnet Dojo
      dojoURL: 'https://staging-dojo.babbage.systems'
    },
    calculateRequestPrice: req => {
      return 300
    }
}))

app.post('/add', (req, res) => { // costs 500 sats
    res.json({
      sum: req.body.a + req.body.b
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
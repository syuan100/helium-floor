const express = require("express")
const bodyParser = require("body-parser")
const routes = require("./routes/routes.js")
const app = express()
const http = require('http').Server(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes(app)

const server = app.listen(3030, function () {
    console.log("app running on port.", server.address().port)
});

////////////////////////////////////////////////////////////

/*
 *  This section is for historic data using 
 *  Google Cloud Firestore
 */

// Firebase Admin
const admin = require('firebase-admin')
var serviceAccount = './admin/hfs-05132018-998b528d42e6.json' // Replace this line with your own keystore file

var db = admin.firestore()

const storeReading = (lastRead, deviceId) => {
  var docRef = db.collection('readings').doc(Math.floor(Date.now() / 1000).toString())
  var device = deviceId ? deviceId : ''
  var setReading = docRef.set({
    reading: lastRead,
    time: Math.floor(Date.now() / 1000),
    deviceId: device
  })
}

////////////////////////////////////////////////////////////

const PubSub = require('@google-cloud/pubsub') // Google Cloud PubSub Library
const io = require('socket.io')() // Socket.io for streaming data to front-end

// Creates a new pubsub client using key file
const pubsub = new PubSub({
  projectId: 'hfs-05132018',
  keyFilename: './admin/helium-floor-sensor-f82b4079512b.json'
})
 
// Reference the existing subscription created in Google IoT Cloud
const subscriptionName = 'fsr-sub'
const subscription = pubsub.subscription(subscriptionName)

var readingStack = []   // init the array to hold the readings
var counter = 0         // counter for delay  

var deviceID            // init ID

// Message flush even handler
const messageFlusher = message => {
  deviceId = message.attributes.deviceId
  message.ack() // "Ack" (acknowledge receipt of) the message
}

// Event handler to handle incoming messages
const messageHandler = message => {

  // Break up incoming 1-second blob into discreet 1/10th second readings
  const rawReading = `${message.data}`
  readingStack.push(rawReading.slice(0, 6))
  readingStack.push(rawReading.slice(6, 12))
  readingStack.push(rawReading.slice(12, 18))
  readingStack.push(rawReading.slice(18, 24))
  readingStack.push(rawReading.slice(24, 30))
  readingStack.push(rawReading.slice(30, 36))
  readingStack.push(rawReading.slice(36, 42))
  readingStack.push(rawReading.slice(42, 48))
  readingStack.push(rawReading.slice(48, 54))
  readingStack.push(rawReading.slice(-6))
  message.ack() // "Ack" (acknowledge receipt of) the message
}

console.log("Waiting for socket to connect...")

// When a client connects, start sending 
io.on('connection', function(socket){
  console.log("Socket Connected!")

  console.log('FLUSHING OLD MESSAGES...')
  subscription.on('message', messageFlusher)

  // Look for messages on subscription object after flushing for 5 seconds
  setTimeout(() => {
    console.log('DONE FLUSHING!')
    subscription.removeListener('message', messageFlusher)  // Remove old listener
    subscription.on('message', messageHandler)

    var stepper = 0

    // Delay, then loop to pop off readings from the top every 10th of a second and emit it to socket
    setTimeout(() => {
      setInterval(() => {
        var lastRead = readingStack.shift()

        if (lastRead !== undefined) {

          socket.emit('device attributes', { deviceId: deviceId })
          // console.log("last reading: " + lastRead)

          // Emit reading to socket
          socket.emit('reading', lastRead)

          stepper++

          // Every 10 readings, send to firestore
          if (stepper === 10) {
            storeReading(lastRead)
            console.log("READING STORED: " + lastRead)
            stepper = 0
          }
        }

      }, 120)
    }, 1200)

  }, 5000)

})

// Set Socket.io to listen on port 3333
io.listen(3333)
console.log('io listening on port 3333')


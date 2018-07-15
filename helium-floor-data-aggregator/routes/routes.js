const admin = require('firebase-admin');
const serviceAccount = require('../admin/helium-floor-sensor-f82b4079512b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
var docsBinder = []

const appRouter = function (app) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API")
  })

  app.get("/firestore", function(req, res) {
    db.collection("readings")
      .orderBy("time", "desc")
      .limit(60).get().then(querySnapshot => {
        docsBinder = []
        querySnapshot.forEach(documentSnapshot => {
          docsBinder.push(documentSnapshot.data())
        });
        res.status(200).send(docsBinder)
      })
  })

}

module.exports = appRouter
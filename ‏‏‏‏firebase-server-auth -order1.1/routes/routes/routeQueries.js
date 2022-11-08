const express = require('express')
const router = express.Router()


const parserDB = require('../models/modelParserDB');

const chartModel = require('../models/modelChart');

router.post('/numberOfEventsInDrive', async function (req, res, next) {
  console.log("in server: numberOfEventsInDrive")
  console.log("cameraId",req.body.cameraId)
  console.log("travelId",req.body.infoTravel)
  // let response = await chartModel.viewOnOneTravel(req.body['camera'], req.body['id'])
  // chartModel.viewOnOneTravel(req.body['cameraId'], req.body['travelId']).then(response => {
  chartModel.viewOnOneTravel(req.body.cameraId, req.body.infoTravel).then(response => {
    // console.log(response)
    res.send(response)
  })

});



router.post('/getTravelsScore', async function (req, res, next) {
  console.log("here")
  let response = await parserDB.parserGetTravelsScore(req.body.camera, req.body.travelIdArr)
  console.log("getTravelsScore: ",response)
  res.send(response)
});


router.post('/viewOnAmountTravels', async function (req, res, next) {
  console.log("here")
  let response = await chartModel.viewOnAmountTravels(req.body['camera'], req.body['id'])
  res.send(response)
});


router.post('/travelOnTime', async function (req, res, next) {
  console.log("start of server travelsOnTime")
  console.log(req.body.id)
  console.log(req.body.camera)
  var response = await chartModel.chartTravelsOnTimes(req.body.camera, req.body.id)
  console.log("end of server travelsOnTime")
  console.log("res in server travelsOnTime",response )
  res.send(response)

});

module.exports = router
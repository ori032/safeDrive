const express = require('express')
const router = express.Router()
const DbServer = require('../dbServer')

DbServer.init();


router.post('/getjson', async function (req, res, next) {
  console.log(res.userData.email)
  // console.log( await DbServer.getAllDataOnCamera("camera_4"))
  // res.send(await DbServer.getAllDataOnCamera("camera_4"));
  DbServer.getAllDataOnCamera("camera_4").then(response => res.send(response));
  // var js = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", }
  // res.send(js);
});

router.post('/getCamerasOfUser', async function (req, res, next) {
  userId = res.userData.email;
  console.log("getCamerasOfUser", userId)
  // userId = "ori123@gmail"
  console.log(userId);
  DbServer.getCamerasOfUser(userId).then(response => res.send(response));
});

router.post('/getTittleTravels', async function (req, res, next) {
  cameraId = req.body.cameraId;
  console.log(cameraId);
  DbServer.getTittleTravels(cameraId).then(response => res.send(response));
});

router.post('/getTravels', async function (req, res, next) {
  cameraId = req.body.cameraId;
  travelId = req.body.travelId;
  console.log("getTravels", cameraId);
  console.log("getTravels", travelId);
  DbServer.getTravels(cameraId, travelId).then(response => res.send(response));
});


router.post('/updateCamera', async function (req, res) {
  userId = res.userData.email;
  cameraId = req.body.cameraId;
  console.log(cameraId);
  DbServer.updateCamera(userId, [cameraId]).then(response => res.send(response));
});

router.post('/deleteCamera', async function (req, res) {
  userId = res.userData.email;
  cameraId = req.body.cameraId;
  console.log(cameraId);
  DbServer.deleteCamera(userId, [cameraId])
  .then(response => res.send(response));
});

module.exports = router



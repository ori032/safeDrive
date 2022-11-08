const express = require('express')
const router = express.Router()
const DbServer = require('../models/modelDbServer')

DbServer.init();


// router.post('/getjson', async function (req, res, next) {
//   console.log(res.userData.email)
//   // console.log( await DbServer.getAllDataOnCamera("camera_4"))
//   // res.send(await DbServer.getAllDataOnCamera("camera_4"));
//   DbServer.getAllDataOnCamera("camera_4").then(response => res.send(response));
//   // var js = { 0: "a", 1: "b", 2: "c", 3: "d", 4: "e", }
//   // res.send(js);
// });

router.post('/getCamerasOfUser', async function (req, res, next) {
  const userId = res.userData.email;
  console.log("getCamerasOfUser", userId)
  // userId = "ori123@gmail"
  console.log(userId);
  DbServer.getCamerasOfUser(userId).then(response => res.send(response));
});

router.post('/getTittleTravels', async function (req, res, next) {
  const cameraId = req.body.cameraId;
  console.log(cameraId);
  DbServer.getTittleTravels(cameraId).then(response => { res.send(response.reverse()) });
});

router.post('/getTravels', async function (req, res, next) {
  const cameraId = req.body.cameraId;
  const travelId = req.body.travelId;
  console.log("getTravels", cameraId);
  console.log("getTravels", travelId);
  DbServer.getTravels(cameraId, travelId).then(response => res.send(response));
});


router.post('/updateCamera', async function (req, res) {
  const userId = res.userData.email;
  const cameraId = req.body.cameraId;
  const pass = req.body.pass;
  console.log("in updateCamera");
  console.log(userId);
  console.log(cameraId);
  console.log(pass);
  console.log(typeof pass);
  DbServer.updateCamera(userId, cameraId, pass).then(response => res.send(response))
    .catch(err => {
      console.log("updateCamera: ",err.message)
      res.send(false);
    });
});

router.post('/deleteCamera', async function (req, res) {
  const userId = res.userData.email;
  cameraId = req.body.cameraId;
  console.log(cameraId);
  DbServer.deleteCamera(userId, [cameraId])
    .then(response => res.send(response));
});


router.post('/signUp', async function (req, res) {
  const userId = res.userData.email;

  DbServer.signUp(userId)
    .then(response => res.send(response));
});


router.post('/setConfOfArrCamera', async function (req, res) {
  // var userId = res.userData.email;
  const camerasArr = req.body.camerasArr;
  const eyes = req.body.eyes;
  const phone = req.body.phone;
  const yawning = req.body.yawning;
  const yawningAlert = req.body.yawningAlert;

  console.log(camerasArr);
  console.log(eyes);
  console.log(phone);
  console.log(yawning);
  console.log(yawningAlert);

  if (req.body.email != undefined) {
    const email = req.body.email;
    DbServer.setConf(camerasArr[0], eyes, phone, yawning, yawningAlert, email)
      .then(response => res.send(response));
  }


  DbServer.setConfOfArrCamera(camerasArr, eyes, phone, yawning, yawningAlert)
    .then(response => res.send(response));
});

router.post('/getConf', async function (req, res) {
  const cameraId = req.body.cameraId;
  console.log(cameraId);

  DbServer.getConf(cameraId)
    .then(response => res.send(response));
});


router.post('/getEmail', async function (req, res) {
  const cameraId = req.body.cameraId;
  console.log("getEmail", cameraId);

  DbServer.getMail(cameraId)
    .then((response) => {
      console.log("getEmail: email", response);
      console.log("getEmail: email", typeof (response));
      res.send(JSON.stringify(response));
    });
});


router.post('/setEmail', async function (req, res) {
  const cameraId = req.body.cameraId;
  const newEmail = req.body.email;
  console.log("setEmail cameraId", cameraId);
  console.log("setEmail newEmail", newEmail);

  DbServer.setMail(cameraId, newEmail)
    .then(() => res.send(true)).catch((err)=>{
      console.log("setEmail: ",err.message);
      res.send(false)
    });
  // res.send(true);

});

// getConf(camera)



module.exports = router



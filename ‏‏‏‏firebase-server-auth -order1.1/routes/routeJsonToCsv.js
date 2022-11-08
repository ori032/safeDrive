const express = require('express')
const router = express.Router()


const JsonToCsv = require('../models/modelJsonToCsv');

router.post('/saveOneTravelToCsv', async function (req, res) {
    cameraId = req.body.cameraId;
    travelId = req.body.travelId;
    console.log("in saveOneTravelToCsv")
    console.log(cameraId)
    console.log(travelId)

    // JsonToCsv.saveOneTravelToCsv(cameraId, travelId)
    //     .then(response => res.send(response));

    JsonToCsv.saveOneTravelToCsv(cameraId, travelId)
        .then((response) => {
            res.download(process.cwd() + "/" + response, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    JsonToCsv.deleteFile(false, cameraId, travelId);
                }
            });
        });


});


router.post('/saveALLTravelToCsv', async function (req, res) {
    console.log("in routeJsonTocSV")
    cameraId = req.body.cameraId;
    travelArrId = req.body.travelArrId;
    console.log("cameraId: ", cameraId);
    console.log("travelArrId: ", travelArrId);

    // JsonToCsv.saveALLTravelToCsv(cameraId, travelArrId)
    //     .then(response => res.send(response));




    JsonToCsv.saveALLTravelToCsv(cameraId, travelArrId)
        .then((response) => {
            res.download(process.cwd() + "/" + response, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    JsonToCsv.deleteFile(true, cameraId, travelArrId);
                }
            });
        });
});

module.exports = router

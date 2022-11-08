const mongoose = require('mongoose');
var sha256 = require('js-sha256');
var travelsConn = null
var userConn = null

var cache = {}

//  the schemas
////////////////////////////////////
const schema = mongoose.Schema

const travelsScema = new schema({
    _id: Number,
    time: String,
    numberOfTravel: Number,
    locations: String
})

const travelsDataScema = new schema({
    _id: Number,
    status: Number,
    time: String,
    massage: String,
    locations: String
})

const userSchema = new schema({
    _id: String,
    cameras: [String]
})

const cameraConf = new schema({
    _id: String,
    eyes: Number,
    phone: Number,
    yawning: Number,
    yawningAlert: Boolean,
    pass: String,
    mail: String
})
/////////////////////////////////////

//The function creates a connection to the DB
async function connectToDb(dbName) {
//Save  in cache
    if (cache[dbName] == undefined) {
        let DatabaseTravelsInfoURL = 'mongodb+srv://any:1111@safe.bgpte.mongodb.net/' + dbName + '?retryWrites=true&w=majority'
        cache[dbName] = await mongoose.createConnection(DatabaseTravelsInfoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (!err) {
                console.log(`MongoDB Connection to ${dbName} info Succeeded.`);
            } else {
                console.log(`Error in DB ${dbName} connection : ` + err);
            }
        });
    }
    return cache[dbName];
}

//The function returns data on travel
async function getTittleTravels(userName) {
    let travelsResults = []
    if (travelsConn == null) {
        travelsConn = await connectToDb("travels")
    }
    let Travel = travelsConn.model(userName, travelsScema)
    let myTravels = await Travel.find()
        .then((result) => {
            result.forEach((item) => {
                var time = item["time"]
                var numberOfTravel = item["numberOfTravel"]
                var locations = item["locations"]
                travelsResults.push({ time, numberOfTravel, locations })
            });
        })

    return travelsResults
}

//The function returns what alerts occurred on a specific travel
async function getTravels(dbName, id, connInfoTravels = null) {
    let info = []
    if (connInfoTravels == null) {
        connInfoTravels = await connectToDb(dbName)
    }
    let Travel1 = connInfoTravels.model('travle_number_' + id, travelsDataScema)
    let myTravelsinfo = await Travel1.find()
        .then((result) => {
            result.forEach((item) => {
                var time = item["time"]
                var massage = item["massage"]
                var status = item["status"]
                var locations = item["locations"]
                info.push({ time, massage, status, locations })
            });
        })
    return info
}

//The function saves a new user in DB
async function signUp(mail, camerasArr = []) {
    let user;
    if (userConn == null) {
        userConn = await connectToDb("users")
    }
    user = userConn.model('User', userSchema);
    var newUser = new user({
        _id: mail,
        cameras: camerasArr
    });
    newUser.save()
}

//The function changes the configurations of a specific camera
async function setConf(camera, eyes, phone, yawning, yawningAlert, mail = null) {
    let camereConn = await connectToDb(camera);
    let confi = await camereConn.model('Configurations', cameraConf);

    if (eyes != null) {
        confi.findOneAndUpdate({ _id: camera }, { eyes: eyes }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("work")
            }
        });
    }

    if (phone != null) {
        confi.findOneAndUpdate({ _id: camera }, { phone: phone }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("work")
            }
        });
    }
    if (yawning != null) {
        confi.findOneAndUpdate({ _id: camera }, { yawning: yawning }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("work")
            }
        });
    }
    if (yawningAlert != null) {
        confi.findOneAndUpdate({ _id: camera }, { yawningAlert: yawningAlert }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("work")
            }
        });
    }
    if (mail != null) {
        confi.findOneAndUpdate({ _id: camera }, { mail: mail }, { upsert: true }, function (err, doc) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("work")
            }
        });
    }
}

//The function changes the configurations of an array of cameras
async function setConfOfArrCamera(camerasArr, eyes, phone, yawning, yawningAlert) {
    console.log(camerasArr)
    camerasArr.forEach((camera) => {
        setConf(camera, eyes, phone, yawning, yawningAlert)
    })
    return true;
}

//The function adds a camera to the user that he can watch
async function updateCamera(mail, camera, pass) {
    let user;

    if (!await checkPass(camera, pass)) {
        return false;
    }
    
    if (userConn == null) {
        userConn = await connectToDb("users")
    }
    user = await userConn.model('User', userSchema);

    await user.findOneAndUpdate({
        _id: mail
    },
        {
            $addToSet: {
                cameras: camera,
            },
        })
    return true;
}

//The function removes a camera from the list of cameras that a user can view
async function deleteCamera(mail, camerasArr) {
    let user;
    if (userConn == null) {
        userConn = await connectToDb("users")
    }
    user = await userConn.model('User', userSchema);

    await user.findOneAndUpdate({
        _id: mail
    },
        {
            $pullAll: {
                cameras: camerasArr,
            },
        })
    return true;
}

//The function returns all the cameras that the user has permission to view
async function getCamerasOfUser(mail) {
    let info = []
    let user;

    if (userConn == null) {
        userConn = await connectToDb("users")
    }
    try {
        user = await userConn.model('User', userSchema)
    }
    catch (error) {
        console.log(error)
        return
    }
    let cameras = await user.findById(mail)
        .then((result) => {
            info = (result["cameras"])
        }).catch((err) => {
            console.log(err)
        });

    return info
}

//The function returns travel data from the camera
async function getAllDataOnCamera(nameOfCamera, arrTravelsId = null) {
    console.log("in getAllDataOnCamera ")

    //Create an array with all the existing travel numbers on the camera
    let travelsData = []
    if (arrTravelsId == null) {
        arrTravelsId = [];
        var travels = await getTittleTravels(nameOfCamera).then((trav) => {
            trav.forEach((item) => {
                arrTravelsId.push(item["numberOfTravel"])
            });
        });
    }

    //save the data
    let connInfoTravels = await connectToDb(nameOfCamera);
    for (travel of arrTravelsId) {
        travelsData.push(await getTravels(nameOfCamera, travel, connInfoTravels))
    }


    return travelsData;
}


async function getAllDataOnAmountOfCameras(nameOfCameraArr) {
    let camerasInfo = []
    for (camera of nameOfCameraArr) {
        camerasInfo.push(await getAllDataOnCamera(camera))
    }
    return camerasInfo;
}

//The function initializes and saves all the necessary connections in each access to the site
async function init() {
    travelsConn = await connectToDb("travels")
    userConn = await connectToDb("users")

}

//The function returns the current configurations in the camera
async function getConf(camera) {
    let info = {};
    let connect = await connectToDb(camera);

    let conf = await connect.model('configurations', cameraConf)
    let confInfo = await conf.find()
        .then((item) => {
            item = item[0];
            info.phone = item.phone;
            info.eyes = item["eyes"];
            info.yawning = item["yawning"];
            info.yawningAlert = item["yawningAlert"];
            info.mail = item["mail"]
        })
    return info
}

//Function for internal use:
//The function checks if the password is correct for the camera
async function checkPass(camera, pass) {
    let connect = await connectToDb(camera);
    let isCorrect = false;

    let conf = await connect.model('configurations', cameraConf)
    let confInfo = await conf.find()
        .then((item) => {
            if (item[0].pass == sha256(pass)) {
                console.log("correct password");
                isCorrect = true;
            }
            else {
                console.log("worng password!")
                isCorrect = false;
            }
        })
    return isCorrect;
}

//The function returns the email associated with the camera
async function getMail(camera) {
    let mail = "";
    let connect = await connectToDb(camera);

    let conf = await connect.model('configurations', cameraConf)
    let confInfo = await conf.find()
        .then((item) => {
            item = item[0];
            mail = item.mail;
        })
    return mail;
}

//The function changes the email associated with the camera
async function setMail(camera, mail) {
    let camereConn = await connectToDb(camera);
    let confi = await camereConn.model('Configurations', cameraConf);

    confi.findOneAndUpdate({ _id: camera }, { mail: mail }, { upsert: true }, function (err, doc) {
        if (err) {
            console.log("error", err)
        }
        else {
            console.log("work")
        }
    });
}


//Function for tests
async function main() {
    //console.log("/////////////////////////id: 1///////////////////////")
    //console.log(await getTittleTravels("camera_1"))

    //console.log("/////////////////////////id: 2///////////////////////")
    //console.log(await getTravels("camera_1", 1))

    //console.log("/////////////////////////id: 3///////////////////////")
    //signUp("yos@gmail",["camera_3", "camera_4"])

    //console.log("/////////////////////////id: 4///////////////////////")
    //updateCamera("ori123@gmail",["camera_23", "camera_24"] )

    //console.log("/////////////////////////id: 5///////////////////////")
    //console.log(await getCamerasOfUser("ori123@gmail"))

    //console.log("/////////////////////////id: 6///////////////////////")
    //console.log(await getAllDataOnCamera("camera_7", [1, 2, 3, 4, 5]))

    //console.log("/////////////////////////id: 7///////////////////////")
    //console.log( await getAllDataOnAmountOfCameras(["camera_4","camera_3"]))

    //console.log("/////////////////////////id: 8///////////////////////")
    //deleteCamera("ori123@gmail",["camera_23","camera_24"] )
    //updateCamera("ori123@gmail", "camera_1", "123")
    //init()
    //console.log(await getCamerasOfUser("ori123@gmail"))


    //console.log(await setConf("camera_"+ i,null ,null ,null , null, "ori.kohen123@gmail.com"))


    //console.log( await getConf("camera_1"))

    //SetConfOfArrCamera(["camera_4","camera_3"], 2,2,2, true)
    //console.log( await getMail("camera_9"))
    await setMail("camera_3", "test@test")
}
//main();

module.exports = {
    getTittleTravels,
    getTravels,
    signUp,
    getCamerasOfUser,
    getAllDataOnCamera,
    updateCamera,
    deleteCamera,
    init,
    setConf,
    getConf,
    setConfOfArrCamera,
    getMail
}
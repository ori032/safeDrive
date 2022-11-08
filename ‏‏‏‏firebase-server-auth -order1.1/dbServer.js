const mongoose = require('mongoose')
var travelsConn = null
var userConn = null


//  the schemas
////////////////////////////////////
const schema = mongoose.Schema

const travelsScema = new schema({
    _id: Number,
    time: String,
    numberOfTravel: Number
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
/////////////////////////////////////

//The function creates a connection to the DB
async function connectToDb(dbName) {
    let DatabaseTravelsInfoURL = 'mongodb+srv://any:1111@safe.bgpte.mongodb.net/' + dbName + '?retryWrites=true&w=majority'
    return conn = await mongoose.createConnection(DatabaseTravelsInfoURL, {
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

//The function returns the travel names that made by the user
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
                travelsResults.push({ time, numberOfTravel })
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
                info.push({ time, massage, status })
            });
        })
    return info
}

async function signUp(mail, camerasArr) {
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

async function updateCamera(mail, camerasArr) {
    let user;
    if (userConn == null) {
        userConn = await connectToDb("users")
    }
    user = await userConn.model('User', userSchema);

    await user.findOneAndUpdate({
        _id: mail
    },
        {
            $addToSet: {
                cameras: camerasArr,
            },
        })
        return true;
}

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
        console.log("////////////////")
        console.log("check the init function")
        console.log("////////////////")
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

async function getAllDataOnCamera(nameOfCamera, travelsName = null) {

    let travelsData = []
    if (travelsName == null) {
        let travelsName = [];
        let travels = await getTittleTravels(nameOfCamera);
        travels.forEach((item) => {
            travelsName.push(item["numberOfTravel"])
        });
    }

    let connInfoTravels = await connectToDb(nameOfCamera)
    for (travel of travelsName) {
        travelsData.push(await getTravels(nameOfCamera, travel, connInfoTravels))
    }
    console.log("in getAllDataOnCamera ")
    return travelsData;
}

async function getAllDataOnAmountOfCameras(nameOfCameraArr) {
    let camerasInfo = []
    for (camera of nameOfCameraArr) {
        camerasInfo.push(await getAllDataOnCamera(camera))
    }
    return camerasInfo;
}

async function init() {
    travelsConn = await connectToDb("travels")
    userConn = await connectToDb("users")

}



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
    //console.log( await getAllDataOnCamera("camera_4"))

    //console.log("/////////////////////////id: 7///////////////////////")
    //console.log( await getAllDataOnAmountOfCameras(["camera_4","camera_3"]))

    //console.log("/////////////////////////id: 8///////////////////////")
    //deleteCamera("ori123@gmail",["camera_23","camera_24"] )
    init()
    console.log(await getCamerasOfUser("ori123@gmail"))
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
}
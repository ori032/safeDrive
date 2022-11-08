const JSONToCsv = require("json2csv").parse;
const { info } = require("console");
const { name } = require("ejs");
const FileSystem = require("fs");
const DbServer = require('./modelDbServer');
const parserDB = require('./modelParserDB');


//The function exports to the file the data on a specific travel
async function saveOneTravelToCsv(camera, id) {
    var mapStatus = { 1: "distractions", 0: "fell asleep", 2: "Tiredness indications" }

    var info = await DbServer.getTravels(camera, id);

    info.forEach((item) => {
        item.status = mapStatus[item.status];
    });

    const csv = JSONToCsv(info, { fields: ["time", "status", "massege", "locations"] });
    var name = `${camera}Travel${id}.csv`
    FileSystem.writeFileSync("./" + name, csv);
    return name;
}

//The function exports to the file the data on all travel in the camera
async function saveALLTravelToCsv(camera, idArr) {
    console.log("in saveALLTravelToCsv");
    var info = await parserDB.numberOfEventsInSumOfTravelsToCsv(camera, idArr);
    const csv = JSONToCsv(info, { fields: ["fell_asleep", "distractions", "Tiredness_indications", "locations", "timeOfTravel"] });
    try {
        var name = `${camera}allTravelS.csv`
        FileSystem.writeFileSync("./" + name, csv);
    } catch (err) {
        console.log("error!: ", err.message);
    }
    return name;
}

//The function deletes files from the server (the Boolean variable announces what the file was called)
async function deleteFile(isAll, camera, id) {
    let fileMame = null;
    if (isAll) {
        fileMame = `./${camera}allTravelS.csv`;
    }
    else {
        fileMame = `./${camera}Travel${id}.csv`;
    }
    FileSystem.unlink(fileMame, (err) => {
        if (err) {
            console.log("error in deleteFile: ", err);
        }
        else {
            console.log(fileMame, "File is deleted.");
        }
    });
    return true;
}


//test
async function main() {
    saveOneTravelToCsv("camera_7", 3);
    // saveALLTravelToCsv("camera_7", [1,2,3,4])
    //deleteFile(true, "camera_7", 3);
    // deleteFile(false, "camera_7", 3);


}


//main();


module.exports = {
    saveOneTravelToCsv,
    saveALLTravelToCsv,
    deleteFile,
}
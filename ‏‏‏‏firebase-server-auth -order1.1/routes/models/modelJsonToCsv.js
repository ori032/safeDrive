const JSONToCsv = require("json2csv").parse;
const { info } = require("console");
const { name } = require("ejs");
const FileSystem = require("fs");
const DbServer = require('./modelDbServer');
const parserDB = require('./modelParserDB');

const mapStatus = { 1: "distractions", 0: "fell asleep", 2: "Tiredness indications" };
const filedOneTravelToCsv =  ["time", "status", "locations"] ;
const filedAllTravelToCsv = ["fell_asleep", "distractions", "Tiredness_indications", "locations", "timeOfTravel"];
const utf8 = "\uFEFF"; 
const oneLine = 1;
const thisFolder = "./" ;


//The function exports to the file the data on a specific travel
async function saveOneTravelToCsv(camera, id) {

    var info = await DbServer.getTravels(camera, id);
    info=info.slice(oneLine);
    info.forEach((item) => {
        item.status = mapStatus[item.status];
    });

    const csv = JSONToCsv(info, { fields: filedOneTravelToCsv });
    var name = `${camera}Travel${id}.csv`
    const csvContent = utf8 + csv;
    FileSystem.writeFileSync( thisFolder + name, csvContent);
    return name;
}

//The function exports to the file the data on all travel in the camera
async function saveALLTravelToCsv(camera, idArr) {
    var info = await parserDB.numberOfEventsInSumOfTravelsToCsv(camera, idArr);
    console.log(info)

    const csv = JSONToCsv(info, { fields: filedAllTravelToCsv });
    try {
        var name = `${camera}allTravelS.csv`
        const csvContent = utf8 + csv;
        FileSystem.writeFileSync( thisFolder + name, csvContent);
    } catch (err) {
        console.log(err.message);
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
            console.log(err);
        }
    });
    return true;
}


//test
async function main() {
    //saveOneTravelToCsv("camera_26", 3);
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
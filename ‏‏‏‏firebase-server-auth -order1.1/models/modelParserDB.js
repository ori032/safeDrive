const DbServer = require('./modelDbServer');

const mapStatus = {"phone":1, "eyesClosing":0, "yawning":2}
const oneLine = 1;
const statusEvent = "status";
const timeEvent = "time";
const locationsEvent = "locations";
const yawningScore =0.4;
const sleepScore = 2;
const phoneScore = 1;
const minVal = -1;


//The function returns all events from travel, in the form of an array
//   arr[ |0:fell asleep|, |1:distractions|, |2:Tiredness indications|]
async function numberOfEventsInTravel(camera, id) {

    let info = await DbServer.getTravels(camera, id)
    let events = await createArrOfIvents(info)
    return events;

}

//The function changes the structure of the array. Designed for use in draw on time
async function reshapeArr(events) {
    Yawning = [];
    phone = [];
    eyesClosing = [];
    data = []
    events.forEach((arr) => {
        eyesClosing.push(arr[mapStatus.eyesClosing]);
        phone.push(arr[mapStatus.phone]);
        Yawning.push(arr[mapStatus.yawning]);
    });
    data.push(eyesClosing);
    data.push(phone);
    data.push(Yawning);
    return data;
}

//The function fills an array of events that were traveling
//   arr[ |0:fell asleep|, |1:distractions|, |2:Tiredness indications|]
async function createArrOfIvents(infoTravel) {
    let events = [0, 0, 0];
    infoTravel=infoTravel.slice(oneLine);
    infoTravel.forEach((e) => {
        events[parseInt(e[statusEvent])] += 1;
    });
    console.log(events);
    return events;
}


//The function returns arrays of events that occurred on travels that the function received
async function numberOfEventsInAmountOfTravels(camera, arrIdTravels, isReshape=false) {
    events = [];
    let infoOnTravels = await DbServer.getAllDataOnCamera(camera, arrIdTravels)

    for (travel of infoOnTravels) {
        info = await createArrOfIvents(travel)
        events.push(info)
    }
    if (isReshape) {
        events = await reshapeArr(events)
    }

    return events;
}

//The function creates a score for each travel
async function parserGetTravelsScore(camera, arrIdTravels) {
    evg = [];
    max = minVal;
    idWorstTravels = minVal;
    let arr =await numberOfEventsInAmountOfTravels(camera,arrIdTravels);
    arr.forEach((travel, index) => {
    let score = travel[mapStatus.eyesClosing] * sleepScore + travel[mapStatus.phone] * phoneScore+ travel[mapStatus.yawning] * yawningScore;   
    evg.push(score);
    if(score > max){
        idWorstTravels = index;
       max= score;
    }
   });
   let ret = {scoreArr: evg, worstTravelIndex :idWorstTravels }
   return ret;
}

//The function creates an array of time and status for each travel
async function createArrOfTimeAndStatus(camera, id) {
    var travel = await DbServer.getTravels(camera, id)
    travel=travel.slice(oneLine);

    let mapEvents = [[], [], []];
    travel.forEach((e) => {
        mapEvents[parseInt(e[statusEvent])].push({x: new Date(e[timeEvent]), y: parseInt(e[statusEvent]) + 1})  
    });
    console.log(mapEvents);
    return mapEvents;
}

//The function creates a map with the data on each travel, in the form of an export to a file
async function numberOfEventsInSumOfTravelsToCsv(camera, arrIdTravels) {
    console.log(" in numberOfEventsInSumOfTravelsToCsv")
    console.log( camera);
    console.log(arrIdTravels);
    let events = [];
    let infoOnTravels = await DbServer.getAllDataOnCamera(camera, arrIdTravels)
    for (travel of infoOnTravels) {
        if(travel.length >0)
        {
        var info = await createArrOfIvents(travel)
        let sleep = info[mapStatus.eyesClosing];
        let phone = info[mapStatus.phone];
        let yawning = info[mapStatus.yawning];
        let timeOfTravel = travel[0][timeEvent];
        let locations = travel[0][locationsEvent];
        events.push({fell_asleep : sleep, distractions : phone, Tiredness_indications : yawning, timeOfTravel : timeOfTravel, locations : locations})
        }
    }
    return events;
}




async function main() {

    //console.log(await createArrOfTimeAndStatus("camera_9",3));
   //console.log(await parserGetTravelsScore ("camera_99",[68, 67]));
}

//main()


///////////////////////////////
module.exports = {
    numberOfEventsInTravel,
    numberOfEventsInAmountOfTravels,
    parserGetTravelsScore,
    createArrOfTimeAndStatus,
    numberOfEventsInSumOfTravelsToCsv,
}

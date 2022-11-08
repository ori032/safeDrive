const DbServer = require('./dbServer');

async function numberOfEventsInTravel(camera, id) {

    let info = await DbServer.getTravels(camera, id)
    let events = await createArrOfIvents(info)
    return events;

}

async function reshapeArr(events) {
    Yawning = [];
    phone = [];
    eyesClosing = [];
    data = []
    events.forEach((arr) => {
        eyesClosing.push(arr[0]);
        phone.push(arr[1]);
        Yawning.push(arr[2]);
    });
    data.push(eyesClosing);
    data.push(phone);
    data.push(Yawning);
    return data;
}

async function createArrOfIvents(infoTravel) {
    let events = [0, 0, 0];
    infoTravel.forEach((e) => {
        events[parseInt(e["status"])] += 1;
    });
    console.log("createArrOfIvents")
    console.log(events);
    return events;
}


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

async function parserGetTravelsScore(camera, arrIdTravels) {
    console.log('camera ',camera)
    console.log('arrIdTravels ',arrIdTravels)
    let yawning = 0.5;//arr[2]
    let sleep = 2;//arr[0]
    let phone = 1;//arrr[1]
    evg =[];
    max =-1;
    idWorstTravels = -1;
   arr =await numberOfEventsInAmountOfTravels(camera,arrIdTravels);
   console.log("arr");
   arr.forEach((travel, index) => {
    score = travel[0] * sleep + travel[1] * phone + travel[2] * yawning;   
    evg.push(score);
    if(score > max){
        idWorstTravels = index;
       max= score;
    }
   });
   ret = {"scoreArr": evg, "worstTravelIndex":idWorstTravels }
   return ret;
}


async function createArrOfTimeAndStatus(camera, id) {
    var travel = await DbServer.getTravels(camera, id)
    console.log("travel in createArrOfTimeEvnts ", travel)
    let mapEvents = [[], [], []];
    travel.forEach((e) => {
        mapEvents[parseInt(e["status"])].push({x: new Date(e["time"]),y: parseInt(e["status"])+1})
    });
    console.log("createArrOfTimeEvnts")
    console.log(mapEvents);
    return mapEvents;
}



//   await arrIdTravels.forEach((id) => {
//     oneTravelInfo = await numberOfEventsInTravel(camera, id)
//     events.push(oneTravelInfo);
// });


async function main() {

    console.log(await numberOfEventsInAmountOfTravels('camera_7', [1, 2, 3]))
}
//main()


///////////////////////////////
module.exports = {
    numberOfEventsInTravel,
    numberOfEventsInAmountOfTravels,
    parserGetTravelsScore,
    createArrOfTimeAndStatus,
}

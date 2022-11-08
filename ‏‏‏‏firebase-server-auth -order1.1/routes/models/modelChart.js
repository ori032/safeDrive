const parserDB = require('./modelParserDB');

const labelEvents = {"yawning":parseInt(0), "phone":parseInt(1) ,"eyes":parseInt(2)}
const empty = 0;
const titlePie = "All events that occurred while traveling in the 'pie' graph";
const noEvents = "splendid! There were no events on this travel!";
const pieGraph = "pie"
const barGraph = "bar"
const labelsGraph =  ['fell asleep', 'distractions', 'Tiredness indications'];
const pieColor =    ['rgba(255, 99, 132, 0.6)','rgba(54, 162, 235, 0.6)','rgba(255, 206, 86, 0.6)']
const blackColor  = "#777";
const whiteColor = "#000";
const borderWidth = 1;
const hoverBorderWidth = 3;
const fontSizePie = 25;
const subtitlePie = 20;
const fontSizeBar = 35;
const SizeBar = 25;
const sizeTen = 10;
const travelTitle = "travel: ";
const redColor = "#8b0000";
const yellowColor = '#f0e68c';
const orangeColor =  '#ff8c00';
const colorEyeTimeGraph = 'rgba(255, 26, 104, 0.2)';
const colorPhoneTimeGraph ='rgba(36, 36, 36, 1)';
const coloryawningTimeGraph ='rgba(11, 156, 49, 1)';


//The function prepares the object "chart" that will prepare the pie graph (graph of a single travel)
async function viewOnOneTravel(camera, info) {
    var text = "";
    var id = info.numberOfTravel;
    ret = await parserDB.numberOfEventsInTravel(camera, id);

    //for debug
    console.log("ret[0]:" + ret[0])
    console.log("ret[1]:" + ret[1])
    console.log("ret[2]:" + ret[2])

    //If no travel events occurred
    if ((ret[labelEvents.yawning] != empty || ret[labelEvents.phone] != empty || ret[labelEvents.eyes] != empty)) {
        text = titlePie;
    }
    else {
        text = noEvents;
    }

    return myJson = {

        type: pieGraph, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: labelsGraph,
            datasets: [{
                data: [
                    ret[labelEvents.yawning],
                    ret[ labelEvents.phone],
                    ret[labelEvents.eyes]
                ],
                backgroundColor: [
                    pieColor[labelEvents.yawning],pieColor[labelEvents.phone],pieColor[labelEvents.eyes]
                ],
                borderWidth: borderWidth,
                borderColor: blackColor,
                hoverBorderWidth: hoverBorderWidth,
                hoverBorderColor: whiteColor
            }]

        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: text,
                    font: {
                        size: fontSizePie
                    },
                    padding: {
                        top: sizeTen,
                        bottom: sizeTen,
                    }
                },
                subtitle: {
                    display: true,
                    text: `The travel start at ${info.time} in "${info.locations}"`,
                    font: {
                        size: subtitlePie
                    },
                    padding: {
                        top: sizeTen,
                        bottom: sizeTen,
                    }
                }
            },
        }
    }
}


//The function prepares the object "chart" that will prepare the bar graph (graph of a sum travel)
async function viewOnAmountTravels(camera, arrId) {
    let red = [];
    let yellow = [];
    let orange = [];
    let black = [];
    labels = []

    ret = await parserDB.numberOfEventsInAmountOfTravels(camera, arrId, true);
    //Creating the labels
    arrId.forEach(element => {
        labels.push(travelTitle + element)
    });

    //Create a color arr that matches the input size
    ret.forEach(element => {
        red.push(redColor);
        yellow.push(yellowColor);
        orange.push(orangeColor);
        black.push(blackColor);
    });


    return myChart = {
        type: barGraph,
        data: {
            labels: labels,
            datasets: [{
                label: labelsGraph[labelEvents.eyes],
                data: ret[labelEvents.eyes],
                backgroundColor: yellow,
                borderColor: black,
                borderWidth: borderWidth
            }, {
                label: labelsGraph[labelEvents.phone],
                data: ret[labelEvents.phone],
                backgroundColor: orange,
                borderColor: black,
                borderWidth: borderWidth
            }, {
                label: labelsGraph[labelEvents.yawning],
                data: ret[labelEvents.yawning],
                backgroundColor: red,
                borderColor: black,
                borderWidth: borderWidth
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Travel comparison in ${camera}`,
                    font: {
                        size: fontSizeBar
                    },
                    padding: {
                        top: SizeBar,
                        bottom: SizeBar,
                        font: {
                            size: SizeBar
                        }
                    }
                }
            }
        }
    };
}


//The function prepares the object "chart" that will prepare the time graph (graph of a single travel)
async function chartTravelsOnTimes(camera, Id) {
    var time = await parserDB.createArrOfTimeAndStatus(camera, Id)
    console.log(time);

    var dataPointsyawning = time[labelEvents.yawning];
    var dataPointsPhone = time[labelEvents.phone];
    var dataPointsEye = time[labelEvents.eyes];
  

    var colorEye = Array(dataPointsPhone.length).fill(colorEyeTimeGraph);
    var colorPhone = Array(dataPointsEye.length).fill(colorPhoneTimeGraph);
    var coloryawning = Array(dataPointsyawning.length).fill(coloryawningTimeGraph);

    const data = {
        datasets: [{
            label: labelsGraph[labelEvents.yawning],
            data: dataPointsPhone,
            backgroundColor: colorEye,
            borderColor: colorEye,
            showLine: false

        }, {
            label: labelsGraph[labelEvents.phone],
            data: dataPointsEye,
            backgroundColor: colorPhone,
            borderColor: colorPhone,
            showLine: false
        }, {
            label: labelsGraph[labelEvents.eyes],
            data: dataPointsyawning,
            backgroundColor: coloryawning,
            borderColor: coloryawning,
            showLine: false
        }
        ]
    }
        ;
    var ret = { data: data };
    return ret;
}


//for test
async function main() {
    //viewOnAmountTravels("camera_7", [1, 2, 3, 4])
}
// main();


module.exports = {
    viewOnOneTravel,
    viewOnAmountTravels,
    chartTravelsOnTimes,
}

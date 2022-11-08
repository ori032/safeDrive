async function drawTarvelsOnTime(cameraId, infoTravel) {
    clearChartContainer();
    drawSpiner();
    
    var travelId = infoTravel.numberOfTravel;
    console.log("----------------------------------------------------------------------------------")
    console.log("info: ",infoTravel);
    console.log("----------------------------------------------------------------------------------")
    var canvas = document.createElement('canvas');

    
    var canvas = document.createElement('canvas');
    container = document.getElementById("chartContainer");
    canvas.class = "my-4";
    canvas.id = "myChart";
    container.appendChild(canvas);

    console.log(" start ejs getTarvelsOnTime")
    // var cam = "camera_7";
    // var idDriver = 1;

    let ret = await postRequestToServer('/queries/travelOnTime', JSON.stringify({ 'camera': cameraId, 'id': travelId }))
    console.log("getTarvelsOnTime", ret)
    var data = ret.data;

    console.log("data.datasets", data.datasets)

    var text ="";
    if(( data.datasets[0].data != 0 ||data.datasets[1].data != 0 ||data.datasets[2].data != 0))
    { 
    text = "All events that occurred while traveling on schedule";
    }
    else{
        text = "splendid! There were no events on this travel!";
    }

    // config 
    const config = {
        type: 'line',
        data,
        options: {
            plugins: {
                title: {
                    display: true,
                    //text: 'The events in ' + cameraId +' in travel that started at ' + infoTravel.time +" on " + infoTravel.locations,
                    text: text,
                    fontFamily: 'Helvetica',
                    font: {
                        size: 20
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                        font: {
                            size: 50
                        }
                    }
                },
                subtitle: {
                    display: true,
                    //text: "The travel start at " + infoTravel.time + '  in '+ info.locations +'"',
                    text: 'The travel start at '+ infoTravel.time+ '  in "'+ infoTravel.locations +'"',
                    font: {
                        size: 20
                    },
                    padding: {
                        top: 10,
                        bottom: 10,
                    }
                }
            
            },
            scales: {
                x: {
                    type: 'time',
                    tyme: {
                        unit: 'hour'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }

                }
            }
        }
    };

    // render init block
    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
    deletSpiner();
}
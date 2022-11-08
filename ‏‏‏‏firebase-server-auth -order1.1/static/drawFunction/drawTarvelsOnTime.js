const title = "All events that occurred while traveling on schedule";
const subTitle = "splendid! There were no events on this travel!";
const empty = 0;

async function drawTarvelsOnTime(cameraId, infoTravel) {
    clearChartContainer();
    drawSpiner();
    
    var travelId = infoTravel.numberOfTravel;
    var canvas = document.createElement('canvas');

    
    var canvas = document.createElement('canvas');
    container = document.getElementById("chartContainer");
    canvas.class = "my-4";
    canvas.id = "myChart";
    container.appendChild(canvas);

    let ret = await postRequestToServer('/queries/travelOnTime', JSON.stringify({ 'camera': cameraId, 'id': travelId }))
    console.log("getTarvelsOnTime", ret)
    var data = ret.data;

    console.log("data.datasets", data.datasets)

    var text ="";
    if(( data.datasets[0].data != empty ||data.datasets[1].data != empty ||data.datasets[2].data != empty))
    { 
    text = title
    }
    else{
        text = subTitle
    }

    const config = {
        type: 'line',
        data,
        options: {
            plugins: {
                title: {
                    display: true,
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
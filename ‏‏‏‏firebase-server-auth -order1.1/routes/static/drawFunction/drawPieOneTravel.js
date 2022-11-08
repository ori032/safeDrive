async function drawPieOneTravel(cameraId, infoTravel) {
    console.log("in drawPieOneTravel")
    console.log("cameraId ", cameraId)
    console.log("travelId ", infoTravel)

    clearChartContainer();
    drawSpiner();

    var canvas = document.createElement('canvas');
    // canvas.style.maxWidth = "400px"
    canvas.style.maxHeight = "400px"
    // canvas.className="d-flex justify-content-center"
    container = document.getElementById("chartContainer");
    // canvas.class = "my-4";
    // canvas.id = "myChart";








    // var cam = "camera_7";
    // var idDriver = 1;
    let ret = await postRequestToServer('/queries/numberOfEventsInDrive', JSON.stringify({ 'cameraId': cameraId, 'infoTravel': infoTravel }))
    console.log("in drawPieOneTravel");
    console.log(ret);
    myChart = canvas.getContext('2d'),


        // Global Options
        // Chart.defaults.global.defaultFontFamily = 'Lato',
        // Chart.defaults.global.defaultFontSize = 18,
        // Chart.defaults.global.defaultFontColor = '#777',
        massPopChart = new Chart(myChart, ret);
    container.appendChild(canvas);
    deletSpiner();





}

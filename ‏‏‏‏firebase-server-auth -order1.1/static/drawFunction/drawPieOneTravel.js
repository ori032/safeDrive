async function drawPieOneTravel(cameraId, infoTravel) {
    clearChartContainer();
    drawSpiner();
    var canvas = document.createElement('canvas');
    canvas.style.maxHeight = "400px"
    container = document.getElementById("chartContainer");
    let ret = await postRequestToServer('/queries/numberOfEventsInDrive', JSON.stringify({ 'cameraId': cameraId, 'infoTravel': infoTravel }))
    console.log("in drawPieOneTravel");
    console.log(ret);
    myChart = canvas.getContext('2d'),
    massPopChart = new Chart(myChart, ret);
    container.appendChild(canvas);
    deletSpiner();





}

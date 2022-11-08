async function drawCompareMarkedTravels(cameraId, traveslId) {
    clearChartContainer();
    drawSpiner();


    var canvas = document.createElement('canvas');
    chartContainer = document.getElementById("chartContainer");
    canvas.class = "my-4";
    // canvas.id = "myChart";
    chartContainer.appendChild(canvas);

    console.log("drawCompareMarkedTravels", traveslId)
    // var cameraId = "camera_7";
    // var traveslId = [1, 2, 3, 4];
    var ret = await postRequestToServer('/queries/viewOnAmountTravels', JSON.stringify({ 'camera': cameraId, 'id': traveslId }))
    
    console.log(ret)
    myChart = canvas.getContext('2d');


    // Global Options
    // Chart.defaults.global.defaultFontFamily = 'Lato',
    // Chart.defaults.global.defaultFontSize = 18,
    // Chart.defaults.global.defaultFontColor = '#777',
    massPopChart = new Chart(myChart, ret);
    deletSpiner();
}


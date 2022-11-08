async function drawCompareMarkedTravels(cameraId, traveslId) {
    clearChartContainer();
    drawSpiner();
    var canvas = document.createElement('canvas');
    chartContainer = document.getElementById("chartContainer");
    canvas.class = "my-4";
    chartContainer.appendChild(canvas);
    var ret = await postRequestToServer('/queries/viewOnAmountTravels', JSON.stringify({ 'camera': cameraId, 'id': traveslId })) 
    console.log(ret)
    myChart = canvas.getContext('2d');
    massPopChart = new Chart(myChart, ret);
    deletSpiner();
}


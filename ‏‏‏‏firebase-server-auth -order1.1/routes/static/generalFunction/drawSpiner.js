function drawSpinerInContainer(container) {
    clearContainer(container)
    var container = document.getElementById(container);
    var loadingP = document.createElement('p');
    loadingP.className = "btn btn-primary";
    var loadingSpan = document.createElement('span');
    loadingSpan.className = "spinner-border spinner-border-sm";
    loadingP.innerHTML = "Loading...";

    loadingP.appendChild(loadingSpan);
    container.appendChild(loadingP)

}

function drawSpiner() {
    deletSpiner();
    var container = document.getElementById('spinerContainer');
    var loadingP = document.createElement('p');
    loadingP.className = "btn btn-primary";
    var loadingSpan = document.createElement('span');
    loadingSpan.className = "spinner-border spinner-border-sm";
    loadingP.innerHTML = "Loading...";

    loadingP.appendChild(loadingSpan);
    container.appendChild(loadingP)

}
function deletSpiner() {
    console.log("deletSpiner")
    clearContainer('spinerContainer')
}
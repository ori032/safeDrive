const mainContainerName="mainContainer";
const buttonContainerName="buttonContainer";
const chartContainerName="chartContainer";

function clearContainer(container) {
  var div = document.getElementById(container);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  console.log("clearContainer: ", container);
}

function clearMainContainer() {
  clearContainer(mainContainerName);
}

function clearChartContainer() {
  clearContainer(chartContainerName);
}

function clearButtonContainer() {
  clearContainer(buttonContainerName);
}


function getContainer(container) {
  const div = document.getElementById(container);
  return div;
}


function getMainContainer() {
  return getContainer(mainContainerName);
}

function getChartContainer() {
  return getContainer(chartContainerName);
}

function getButtonContainer() {
  return getContainer(buttonContainerName);
}








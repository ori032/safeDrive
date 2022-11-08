function clearcCntainer(container) {
    var div = document.getElementById(container);

    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    console.log("clearcCntainer: ",container);
  }
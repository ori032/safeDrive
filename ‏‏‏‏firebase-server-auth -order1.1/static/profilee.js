document.addEventListener("DOMContentLoaded", () => {

    ///////////////////////////////  EDIT CAMERAS   /////////////////////////////////////

    async function drawCamerasEditButton() {
        drawSpiner("buttonContainer")

        try {
            var camerasArr = await postRequestToServer("/dbServer/getCamerasOfUser");
            console.log(camerasArr);
        } catch (err) {
            console.log(err.message);
            return;
        }

        clearcCntainer("container");
        clearcCntainer("buttonContainer");

        var container = document.getElementById('buttonContainer');

        var button = createAddCameraCard("camera", (function () { return console.log(camera) }));
        container.appendChild(button);

        camerasArr.forEach((camera) => {
            var button = createDeleteCameraCard(camera);
            container.appendChild(button);

        });
    }
    document.getElementById("editCameras").addEventListener("click", drawCamerasEditButton);

    function createDeleteCameraCard(camera) {
        var div = document.createElement('div');
        div.className = "card text-white bg-secondary mb-3"
        div.style = "width: 18rem;"

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = camera

        div.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        div.appendChild(cardBody);


        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);


        // var input = document.createElement('input')
        // input.id = "camera"
        // form.appendChild(input);


        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Delete camera";
        button.className = "form-control"
        button.className = 'btn btn-primary';

        form.appendChild(button);



        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            try {
                var tittleTravelsArr = await postRequestToServer("/dbServer/deleteCamera", JSON.stringify({ cameraId: camera }));
                console.log(tittleTravelsArr);
            } catch (err) {
                console.log(err.message);
                return;

            }
            drawCamerasEditButton()
        });



        return div;

    }

    function createAddCameraCard(camera, onclickFunck) {
        var div = document.createElement('div');
        div.className = "card text-white bg-secondary mb-3"
        div.style = "width: 18rem;"

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = "Adding a new camera"

        div.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        div.appendChild(cardBody);


        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);


        var input = document.createElement('input')
        input.id = "camera"
        input.className = "form-text text-muted"
        form.appendChild(input);


        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Add camera";
        button.className = "form-control"

        form.appendChild(button);

        var cardText = document.createElement('p');
        cardText.className = "card-text"


        button.className = 'btn btn-primary';



        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const camera = event.target.camera.value;
            console.log(camera)
            console.log(name)

            try {
                var tittleTravelsArr = await postRequestToServer("/dbServer/updateCamera", JSON.stringify({ cameraId: camera }));
                console.log(tittleTravelsArr);
            } catch (err) {
                console.log(err.message);
                return;

            }
            drawCamerasEditButton()
        })


        cardBody.appendChild(cardText);
        return div;

    }

    ////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////  DRAW SPINER   /////////////////////////////////////


    function drawSpiner(container) {
        clearcCntainer(container)
        var container = document.getElementById('buttonContainer');
        var loadingP = document.createElement('p');
        loadingP.className = "btn btn-primary";
        var loadingSpan = document.createElement('span');
        loadingSpan.className = "spinner-border spinner-border-sm";
        loadingP.innerHTML = "Loading...";

        loadingP.appendChild(loadingSpan);
        container.appendChild(loadingP)

    }


    /////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////  CAMERAS MENU   /////////////////////////////////////


    async function drawAllCamerasButton() {
        drawSpiner("buttonContainer")

        try {
            var camerasArr = await postRequestToServer("/dbServer/getCamerasOfUser");
            console.log(camerasArr);
        } catch (err) {
            console.log(err.message);
            return;
        }
        var container = document.getElementById('buttonContainer');

        clearcCntainer("container");
        clearcCntainer("buttonContainer");


        camerasArr.forEach((camera) => {
            var onclickFunck = (function () { return drawAllTittleTravelsButton(camera) });
            var button = createCameraCard(camera, onclickFunck);


            container.appendChild(button);
        });

    }

    document.getElementById("CamerasMenu").addEventListener("click", drawAllCamerasButton);


    async function drawAllTittleTravelsButton(camera) {
        clearcCntainer("buttonContainer");
        var container = document.getElementById("buttonContainer");



        console.log(camera)
        try {
            var tittleTravelsArr = await postRequestToServer("/dbServer/getTittleTravels", JSON.stringify({ cameraId: camera }));
            console.log(tittleTravelsArr);

        } catch (err) {
            console.log(err.message);
            return;

        }


        if ((tittleTravelsArr.length) < 1) {
            var cardText = document.getElementById(`card-text ${camera}`);
            cardText.innerHTML = "no travels";
            return;
        }
        var travelIdArr = []
        var buttonsArr = []

        var form = document.createElement('form');
        form.className = "form-group"

        tittleTravelsArr.forEach((tittleTravel) => {
            console.log(tittleTravel)
            console.log(tittleTravel["numberOfTravel"])
            var travelId = tittleTravel["numberOfTravel"]
            travelIdArr.push(travelId)

            var button = document.createElement('input');
            button.type = 'button';
            button.id = 'submit';
            button.value = "show travel " + travelId;
            // button.className = 'btn';
            button.className = "btn btn-outline-success"

            button.onclick = (async function () {
                console.log(camera)
                try {
                    var travelsArr = await postRequestToServer("/dbServer/getTravels", JSON.stringify({ cameraId: camera, travelId: travelId }));
                    console.log(travelsArr);
                    await drawPieOneTravel(camera, travelId);


                } catch (err) {
                    console.log(err.message);
                    return;

                }
            });
            var checkbox = document.createElement('INPUT');
            checkbox.setAttribute("type", "checkbox");
            // checkbox.name = `checkbox ${camera}`;
            checkbox.name = `checkboxTravels`;
            checkbox.value = travelId;






            var div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(button);
            form.appendChild(div);
            buttonsArr.push(button);
        });
        container.appendChild(form);


        var sbmitCheckbox = document.createElement('input');
        sbmitCheckbox.type = 'button';
        sbmitCheckbox.className = "btn btn-primary";
        sbmitCheckbox.id = "sbmitCheckbox";
        sbmitCheckbox.value = "Compare all travels";
        sbmitCheckbox.addEventListener("click", async (event) => {
            let checkboxes = document.querySelectorAll('input[name="checkboxTravels"]');
            let values = [];
            console.log("values", values)
            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            if (values.length <= 0) {
                alert("There is no travels for this camera");
                return;
            }
            var cameraId = camera;
            var traveslId = values;
            await drawCompareMarkedTravels(cameraId, traveslId);
        })


        var div = document.createElement('div');
        div.appendChild(sbmitCheckbox);
        container.appendChild(div);

        // ///////////////////////////////////////////////////////////////
        var sbmitCheckbox = document.createElement('input');
        sbmitCheckbox.type = 'button';
        sbmitCheckbox.className = "btn btn-primary";
        sbmitCheckbox.id = "sbmitCheckbox";
        sbmitCheckbox.value = "Compare marked travels";
        sbmitCheckbox.addEventListener("click", async (event) => {
            let checkboxes = document.querySelectorAll('input[name="checkboxTravels"]:checked');
            let values = [];
            console.log("values", values)
            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            if (values.length <= 0) {
                alert("You need to mark the traves you want to compare");
                return;
            }

            var cameraId = camera;
            var traveslId = values;
            await drawCompareMarkedTravels(cameraId, traveslId);
        })

        var div = document.createElement('div');
        div.appendChild(sbmitCheckbox);
        container.appendChild(div);

        // ///////////////////////////////////////////////////////////////

        


        // ///////////////////////////////////////////////////////////////


        var sbmitCheckbox = document.createElement('input');
        sbmitCheckbox.type = 'button';
        sbmitCheckbox.className = "btn btn-primary";
        sbmitCheckbox.id = "sbmitCheckbox";
        sbmitCheckbox.value = "Show the worst travel";

        

        var div = document.createElement('div');
        div.appendChild(sbmitCheckbox);
        container.appendChild(div);


        var worstTravelbutton = await drawTravelScore(buttonsArr, camera, travelIdArr);
        sbmitCheckbox.addEventListener("click", async (event) => {
            worstTravelbutton.onclick();
         })








    }

    async function drawTravelScore(buttonsArr, camera, travelIdArr) {
        console.log("in drawScore");
        console.log("travelIdArr ", travelIdArr)

        var travelsScoreArr = await postRequestToServer('/getTravelsScore', JSON.stringify({ 'camera': camera, 'travelIdArr': travelIdArr }))
        console.log(travelsScoreArr)
        buttonsArr.forEach((button, index) => {
            button.value = button.value + " " + travelsScoreArr['scoreArr'][index]
        })
        worstTravelIndex = travelsScoreArr['worstTravelIndex']
        buttonsArr[worstTravelIndex].style.backgroundColor = "red";
        // travelsScoreArr
        return buttonsArr[worstTravelIndex]

    }



    function createCameraCard(name, onclickFunck) {
        var div = document.createElement('div');
        div.className = "card text-white bg-secondary mb-3"
        div.style = "width: 18rem;"
        div.id = name

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = name

        div.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        div.appendChild(cardBody);


        var cardText = document.createElement('p');
        cardText.className = "card-text"
        cardText.id = `card-text ${name}`


        var button = document.createElement('input');
        button.type = 'button';
        button.id = 'submit';
        button.value = "Show travels";


        button.className = 'btn btn-primary';


        button.onclick = onclickFunck;

        cardBody.appendChild(button);
        cardBody.appendChild(cardText);
        return div;

    }

    ///////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////  SERVER REQUEST   /////////////////////////////////////



    function postRequestToServer(path, body = "") {

        return new Promise((resolve, reject) => {
            fetch(path, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: body,
            }).then(response => response.json())

                .then(json => {
                    console.log("in postRequestToServer");
                    resolve(json);
                })
                .catch(err => {
                    console.log(err.message)
                    reject(err)
                });
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////  DRAW CHART   /////////////////////////////////////

    async function drawPieOneTravel(cameraId, travelId) {
        console.log("in drawPieOneTravel")
        console.log("cameraId ", cameraId)
        console.log("travelId ", travelId)

        clearcCntainer("container");

        var canvas = document.createElement('canvas');
        container = document.getElementById("container");
        canvas.class = "my-4";
        // canvas.id = "myChart";








        // var cam = "camera_7";
        // var idDriver = 1;
        let ret = await postRequestToServer('/numberOfEventsInDrive', JSON.stringify({ 'cameraId': cameraId, 'travelId': travelId }))
        console.log("in drawPieOneTravel");
        console.log(ret);
        myChart = canvas.getContext('2d'),


            // Global Options
            Chart.defaults.global.defaultFontFamily = 'Lato',
            Chart.defaults.global.defaultFontSize = 18,
            Chart.defaults.global.defaultFontColor = '#777',
            massPopChart = new Chart(myChart, ret);
        container.appendChild(canvas);





    }

    // document.getElementById("customers").addEventListener("click", drawPieOneTravel);


    //////////////////////////////// Compare marked travels //////////////////////////////////////
    async function drawCompareMarkedTravels(cameraId, traveslId) {
        clearcCntainer("container");

        var canvas = document.createElement('canvas');
        container = document.getElementById("container");
        canvas.class = "my-4";
        // canvas.id = "myChart";
        container.appendChild(canvas);


        // var cameraId = "camera_7";
        // var traveslId = [1, 2, 3, 4];
        let ret = await postRequestToServer('/ori', JSON.stringify({ 'camera': cameraId, 'id': traveslId }))
        console.log(ret)
        myChart = canvas.getContext('2d'),


            // Global Options
            Chart.defaults.global.defaultFontFamily = 'Lato',
            Chart.defaults.global.defaultFontSize = 18,
            Chart.defaults.global.defaultFontColor = '#777',
            massPopChart = new Chart(myChart, ret);
    }
    


    //////////////////////////////////Tarvels On Time///////////////////////////////////////////
    async function drawTarvelsOnTime() {
        clearcCntainer("container");

        var canvas = document.createElement('canvas');
        container = document.getElementById("container");
        canvas.class = "my-4";
        canvas.id = "myChart";
        container.appendChild(canvas);
        
        console.log(" start ejs getTarvelsOnTime")
        var cam = "camera_7";
        var idDriver = 1;
  
        let ret = await postRequestToServer('/travelOnTime', JSON.stringify({ 'camera': cam, 'id': idDriver }))
        console.log("getTarvelsOnTime", ret)
        var data = ret.data;
        console.log("ret(0) in ejs getTarvelsOnTime() ", ret)
  
        // config 
        const config = {
          type: 'line',
          data,
          options: {
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
      }
      ///////////////////////////////////////////////////////////////////
      document.getElementById("customers").addEventListener("click", drawTarvelsOnTime);

});
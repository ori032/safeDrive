document.addEventListener("DOMContentLoaded", () => {

    var title = "Export To Exel";
    var instructions = "Export information about a single travel or several together"
    async function drawAllCamerasButton() {
        changeSubTitleAndInstructions(title, instructions);
        clearMainContainer();
        clearChartContainer();
        clearButtonContainer();
        drawSpiner();

        try {
            var camerasArr = await postRequestToServer("/dbServer/getCamerasOfUser");
            console.log(camerasArr);
        } catch (err) {
            console.log(err.message);
            return;
        }
        const mainContainer = getMainContainer();

        deletSpiner();


        camerasArr.forEach((cameraId) => {

            // var cameraCard = createCameraCard(cameraId);
            // cameraCard.addEventListener("click", () => {
            //     drawAllTittleTravelsButton(cameraId);
            // })


            var onclickFunck = (function () { return drawAllTittleTravelsButton(cameraId) });
            var exportCard = createCardWithButton(cameraId, cameraId, "Show travels", onclickFunck);

            // mainContainer.appendChild(cameraCard);
            safeAppendElementToContainer(exportCard, mainContainer, title);
        });

    }


    // function createCameraCard(camreId) {
    //     var div = document.createElement('div');
    //     div.className = "card text-white bg-dark mb-3"
    //     div.style = "width: 18rem;"
    //     div.id = camreId

    //     var cardHeader = document.createElement('div')
    //     cardHeader.className = "card-header"
    //     cardHeader.innerHTML = camreId

    //     div.appendChild(cardHeader)



    //     var cardBody = document.createElement('div')
    //     cardBody.className = "card-body"

    //     div.appendChild(cardBody);


    //     var cardText = document.createElement('p');
    //     cardText.className = "card-text"
    //     cardText.id = `card-text ${camreId}`


    //     var button = document.createElement('input');
    //     button.type = 'button';
    //     button.id = 'submit';
    //     button.value = "Show travels";


    //     button.className = 'btn btn-primary';


    //     // button.onclick = onclickFunck;

    //     cardBody.appendChild(button);
    //     cardBody.appendChild(cardText);
    //     return div;

    // }

    document.getElementById("exportToExel").addEventListener("click", drawAllCamerasButton);

    async function drawAllTittleTravelsButton(camera) {
        clearMainContainer();
        clearChartContainer();
        drawSpiner();

        const mainContainer = getMainContainer();



        console.log(camera)
        try {
            var tittleTravelsArr = await postRequestToServer("/dbServer/getTittleTravels", JSON.stringify({ cameraId: camera }));
            // tittleTravelsArr = tittleTravelsArr.reverse();
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

        var scrollDiv = document.createElement('div');
        scrollDiv.setAttribute("class", "border border-primary rounded overflow-auto p-3 mb-3 mb-md-0 me-md-3")
        scrollDiv.setAttribute("style", "max-height: 500px")
        // var scrollDiv = document.createElement('form');
        // scrollDiv.className = "form-group"

        tittleTravelsArr.forEach((infoTravel) => {
            console.log(infoTravel)
            console.log(infoTravel["numberOfTravel"])
            var travelId = infoTravel["numberOfTravel"]
            var travelTime = infoTravel["time"];
            var travelLocations = infoTravel["locations"];
            travelIdArr.push(travelId)

            var button = document.createElement('input');
            button.type = 'button';
            button.id = 'submit';
            button.value = "travel: " + travelTime + " " + travelLocations;
            // button.className = 'btn';
            button.className = "btn btn-outline-success dropdown-toggle";
            button.setAttribute("style", "width: 500px;border-color: white; border-bottom: solid; border-bottom-width: thin;")
            button.className = "btn btn-outline-primary dropdown-toggle rounded-0";
            button.setAttribute("data-toggle", "dropdown");
            button.setAttribute("aria-haspopup", "true");
            button.setAttribute("aria-expanded", "false");

            button.onclick = (async function () {
                drawSpiner();
                console.log(camera)
                try {
                    // var travelsArr = await postRequestToServer("/dbServer/getTravels", JSON.stringify({ cameraId: camera, travelId: travelId }));
                    // var travelsArr = await postRequestToServer("/jsonToCsv/saveOneTravelToCsv", JSON.stringify({ cameraId: camera, travelId: travelId }));
                    var body = JSON.stringify({ cameraId: camera, travelId: travelId });
                    var fileName = `${camera}Travel${travelId}`
                    var res = await downloadPostRequest("/jsonToCsv/saveOneTravelToCsv", body, fileName);

                } catch (err) {
                    console.log(err.message);
                    return;

                }
                deletSpiner();
            });
            var checkbox = document.createElement('INPUT');
            checkbox.setAttribute("type", "checkbox");
            // checkbox.name = `checkbox ${camera}`;
            checkbox.name = `checkboxTravels`;
            checkbox.value = travelId;
            checkbox.className = "form-check-input me-2"
            // checkbox.value = tittleTravel;





            var div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(button);
            scrollDiv.appendChild(div);
            buttonsArr.push(button);


            var menuDiv = document.createElement('div');
            menuDiv.className = "dropdown-menu";
            menuDiv.ariaLabel = "dropdownMenuButton";
            var a = document.createElement('a');
            a.className = "dropdown-item";
            a.innerHTML = "action"
            menuDiv.appendChild(a);
            var a = document.createElement('a');
            a.className = "dropdown-item";
            a.innerHTML = "action2"
            menuDiv.appendChild(a);
            div.appendChild(menuDiv);
            div.className = "dropdown show"


        });
        deletSpiner();
        var div = document.createElement("div")
        div.setAttribute("class", "overflow-auto")
        div.appendChild(scrollDiv);
        mainContainer.appendChild(div)



        var backToAllCamerasButton = createButtonInDiv("BackToAllCameras", "Back to all cameras"
            , drawAllCamerasButton, "warning");

        safeAppendElementToContainer(backToAllCamerasButton, buttonContainerName, title);


        async function compareAllTravelsFunc() {
            drawSpiner();
            var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]');
            var values = [];
            console.log("values", values)
            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            if (values.length <= 0) {
                alert("There is no travels for this camera");
                return;
            }
            var cameraId = camera;
            var travelArrId = values;

            var body = JSON.stringify({ cameraId: camera, travelArrId: travelArrId });
            var fileName = `${camera}allTravelS`;
            var res = await downloadPostRequest("/jsonToCsv/saveAllTravelToCsv", body, fileName);

            deletSpiner();
        }

        var exporAllTravelsButton = createButtonInDiv("exporAllTravelsButton", "Export all travels"
            , compareAllTravelsFunc);

        safeAppendElementToContainer(exporAllTravelsButton, buttonContainerName, title);

        // var compareAllTravelsButton = document.createElement('input');
        // compareAllTravelsButton.type = 'button';
        // compareAllTravelsButton.className = "btn btn-primary";
        // compareAllTravelsButton.id = "compareAllTravels";
        // compareAllTravelsButton.value = "Compare all travels";
        // compareAllTravelsButton.addEventListener("click", async (event) => {
        //     drawSpiner();
        //     var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]');
        //     var values = [];
        //     console.log("values", values)
        //     checkboxes.forEach((checkbox) => {
        //         values.push(checkbox.value);
        //     });
        //     if (values.length <= 0) {
        //         alert("There is no travels for this camera");
        //         return;
        //     }
        //     var cameraId = camera;
        //     var travelArrId = values;

        //     var body = JSON.stringify({ cameraId: camera, travelArrId: travelArrId });
        //     var fileName = `${camera}allTravelS`;
        //     var res = await downloadPostRequest("/jsonToCsv/saveAllTravelToCsv", body, fileName);

        //     deletSpiner();
        // })


        // var div = document.createElement('div');
        // div.appendChild(compareAllTravelsButton);
        // container.appendChild(div);

        // ///////////////////////////////////////////////////////////////


        async function compareMarkedTravelsFunc() {
            drawSpiner();
            var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]:checked');
            var values = [];
            console.log("values", values)
            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            if (values.length <= 0) {
                alert("You need to mark the traves you want to compare");
                deletSpiner();
                return;
            }

            var cameraId = camera;
            var travelArrId = values;
            var body = JSON.stringify({ cameraId: camera, travelArrId: travelArrId });
            var fileName = `${camera}allTravelS`;
            var res = await downloadPostRequest("/jsonToCsv/saveAllTravelToCsv", body, fileName);
            deletSpiner();
        }

        var exporMarkedTravelsButton = createButtonInDiv("exporMarkedTravelsButton", "Export marked travels"
            , compareMarkedTravelsFunc);

        safeAppendElementToContainer(exporMarkedTravelsButton, buttonContainerName, title);



        // var sbmitCheckbox = document.createElement('input');
        // sbmitCheckbox.type = 'button';
        // sbmitCheckbox.className = "btn btn-primary";
        // sbmitCheckbox.id = "sbmitCheckbox";
        // sbmitCheckbox.value = "Compare marked travels";
        // sbmitCheckbox.addEventListener("click", async (event) => {
        //     drawSpiner();
        //     var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]:checked');
        //     var values = [];
        //     console.log("values", values)
        //     checkboxes.forEach((checkbox) => {
        //         values.push(checkbox.value);
        //     });
        //     if (values.length <= 0) {
        //         alert("You need to mark the traves you want to compare");
        //         return;
        //     }

        //     var cameraId = camera;
        //     var travelArrId = values;
        //     // await drawCompareMarkedTravels(cameraId, traveslId);
        //     // var res = await postRequestToServer("/jsonToCsv/saveAllTravelToCsv", JSON.stringify({ cameraId: cameraId, travelArrId: travelArrId }));
        //     var body = JSON.stringify({ cameraId: camera, travelArrId: travelArrId });
        //     var fileName = `${camera}allTravelS`;
        //     var res = await downloadPostRequest("/jsonToCsv/saveAllTravelToCsv", body, fileName);
        //     deletSpiner();
        // })

        // var div = document.createElement('div');
        // div.appendChild(sbmitCheckbox);
        // container.appendChild(div);

        // ///////////////////////////////////////////////////////////////




        // ///////////////////////////////////////////////////////////////

        var worstTravelbutton = await drawTravelScore(buttonsArr, camera, travelIdArr);
        async function ExportTheWorstTravelFunc() {
            worstTravelbutton.onclick();
        }

        var ExportTheWorstTravelButton = createButtonInDiv("ExportTheWorstTravelButton", "Export the worst travel"
            , ExportTheWorstTravelFunc, "danger");

        safeAppendElementToContainer(ExportTheWorstTravelButton, buttonContainerName, title);


        // var sbmitCheckbox = document.createElement('input');
        // sbmitCheckbox.type = 'button';
        // sbmitCheckbox.className = "btn btn-primary";
        // sbmitCheckbox.id = "sbmitCheckbox";
        // sbmitCheckbox.value = "Show the worst travel";



        // var div = document.createElement('div');
        // div.appendChild(sbmitCheckbox);
        // container.appendChild(div);


        // var worstTravelbutton = await drawTravelScore(buttonsArr, camera, travelIdArr);
        // sbmitCheckbox.addEventListener("click", async (event) => {
        //     worstTravelbutton.onclick();
        // });
    }

    async function drawTravelScore(buttonsArr, camera, travelIdArr) {
        console.log("in drawScore");
        console.log("travelIdArr ", travelIdArr)

        var travelsScoreArr = await postRequestToServer('/queries/getTravelsScore', JSON.stringify({ 'camera': camera, 'travelIdArr': travelIdArr }))
        console.log(travelsScoreArr)
        // buttonsArr.forEach((button, index) => {
        //     button.value = button.value + " " + travelsScoreArr['scoreArr'][index]
        // })
        worstTravelIndex = travelsScoreArr['worstTravelIndex']
        buttonsArr[worstTravelIndex].style.backgroundColor = "red";
        // travelsScoreArr
        return buttonsArr[worstTravelIndex]

    }


    

})





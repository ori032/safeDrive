document.addEventListener("DOMContentLoaded", () => {
    const title = "Cameras Menu"
    const instructions = "Select a camera and compare travels"
    async function drawAllCamerasButton() {

        changeSubTitleAndInstructions(title, instructions)




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
        // const mainContainer = getMainContainer();
        const mainContainer = getMainContainer();

        deletSpiner();



        camerasArr.forEach((cameraId) => {

            var onclickFunck = (function () { return drawAllTittleTravelsButton(cameraId) });
            var showTravelsCard = createCardWithButton(cameraId, cameraId, "Show travels", onclickFunck);
            safeAppendElementToContainer(showTravelsCard, mainContainer, title);

        });

    }

    document.getElementById("CamerasMenu").addEventListener("click", drawAllCamerasButton);


    async function drawAllTittleTravelsButton(camera) {
        const title = "Cameras Menu " + camera
        const instructions = "See information about a single travel or compare several together"

        changeSubTitleAndInstructions(title, instructions);
        clearMainContainer();
        clearChartContainer();
        drawSpiner();

        const mainContainer = getMainContainer();
        const buttonContainer = getButtonContainer();
        
        // var buttonContainer = document.getElementById("buttonContainer");





        try {
            var tittleTravelsArr = await postRequestToServer("/dbServer/getTittleTravels", JSON.stringify({ cameraId: camera }));
        } catch (err) {
            console.log(err.message);
            return;
        }


        if ((tittleTravelsArr.length) < 1) {
            var cardText = document.getElementById("card-text" + camera);
            cardText.innerHTML = "no travels!";
            return;
        }
        var travelIdArr = []
        var buttonsArr = []

        var scrollDiv = document.createElement('div');
        scrollDiv.setAttribute("class", "border border-primary rounded overflow-auto p-3 mb-3 mb-md-0 me-md-3")
        scrollDiv.setAttribute("style", "max-height: 500px")
        // scrollDiv.setAttribute("style","width: 500px")


        tittleTravelsArr.forEach((infoTravel) => {
            // console.log(infoTravel)
            // console.log(infoTravel["numberOfTravel"])
            var travelId = infoTravel["numberOfTravel"]
            var travelTime = infoTravel["time"];
            var travelLocations = infoTravel["locations"];
            travelIdArr.push(travelId)

            var button = document.createElement('button');
            button.type = 'button';
            button.id = 'dropdownMenuButton' + travelTime;
            // button.innerHTML = "travel: " + travelTime + "<br />" + travelLocations;
            button.innerHTML = "travel " + travelId + ": " + travelTime + " " + travelLocations;
            button.setAttribute("style", "width: 500px;border-color: white; border-bottom: solid; border-bottom-width: thin;")
            // button.className = 'btn';
            button.className = "btn btn-outline-primary dropdown-toggle rounded-0";
            button.setAttribute("data-toggle", "dropdown");
            button.setAttribute("aria-haspopup", "true");
            button.setAttribute("aria-expanded", "false");
            //  aria-haspopup="true" aria-expanded="false"



            var checkbox = createCheckbox("checkboxTravels", travelId);


            var div = document.createElement('div');

            div.appendChild(checkbox);
            div.appendChild(button);
            scrollDiv.appendChild(div);
            buttonsArr.push(div);


            var menuDiv = document.createElement('div');
            menuDiv.className = "dropdown-menu";
            menuDiv.ariaLabel = 'dropdownMenuButton' + travelTime;



            var dropdownItem = createDropdownItem(travelId, async () => {
                drawPieOneTravel(camera, infoTravel)
                    .catch((err) => {
                        console.log(err.message)
                    });
            });
            menuDiv.appendChild(dropdownItem);


            var dropdownItem = createDropdownItem(travelId, async () => {
                drawTarvelsOnTime(camera, infoTravel)
                    .catch((err) => {
                        console.log(err.message)
                    });
            });
            menuDiv.appendChild(dropdownItem);



            div.appendChild(menuDiv);
            div.className = "dropdown"


        });
        deletSpiner();
        // ///////////////////////////////////////////////////////////////


        var backToAllCamerasButton = createButtonInDiv("BackToAllCameras", "Back to all cameras"
            , drawAllCamerasButton, "warning");

        safeAppendElementToContainer(backToAllCamerasButton, buttonContainer, title);



        // ///////////////////////////////////////////////////////////////

        // clearButtonContainer();
        var div = document.createElement("div")
        // div.className= "overflow-auto"
        div.setAttribute("class", "overflow-auto")
        div.appendChild(scrollDiv);
        mainContainer.appendChild(div);


        // ///////////////////////////////////////////////////////////////

        async function compareAllFunc() {
            var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]');
            var values = [];

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

        }

        var compareAllButton = createButtonInDiv("compareAllButton", "Compare all travels"
            , compareAllFunc, "primary");

        // compareAllButton.addEventListener("click", async (event) => {
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
        //     var traveslId = values;
        //     await drawCompareMarkedTravels(cameraId, traveslId);
        // })


        // var div = document.createElement('div');
        // div.className = "p-2"
        // div.appendChild(compareAllButton);
        // div.id = "compareAllButtonDiv"
        // // buttonContainer.appendChild(div);
        safeAppendElementToContainer(compareAllButton, buttonContainer, title);

        // ///////////////////////////////////////////////////////////////
        async function compareMarkedFunc() {
            var checkboxes = document.querySelectorAll('input[name="checkboxTravels"]:checked');
            var values = [];

            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            if (values.length <= 0) {
                alert("You need to mark the travels you want to compare");
                return;
            }
            var cameraId = camera;
            var traveslId = values;
            await drawCompareMarkedTravels(cameraId, traveslId);
        }

        var compareMarkedButton = createButtonInDiv("compareMarkedButton", "Compare marked travels"
            , compareMarkedFunc, "primary");
        // var compareMarkedButton = document.createElement('input');
        // compareMarkedButton.type = 'button';
        // compareMarkedButton.className = "btn btn-primary";
        // compareMarkedButton.id = "compareMarkedButton";
        // compareMarkedButton.value = "Compare marked travels";
        // compareMarkedButton.addEventListener("click", async (event) => {
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
        //     var traveslId = values;
        //     await drawCompareMarkedTravels(cameraId, traveslId);
        // })

        // var div = document.createElement('div');
        // div.appendChild(compareMarkedButton);
        // div.className = "p-2"
        // div.id = "compareMarkedButtonDiv"
        // // buttonContainer.appendChild(div);
        safeAppendElementToContainer(compareMarkedButton, buttonContainer, title);

        // ///////////////////////////////////////////////////////////////





        // var sendEmailHref = document.createElement('a');
        // sendEmailHref.setAttribute("href", `/sendEmail?cameraId=${camera}`)
        // sendEmailHref.setAttribute("value", "send email")
        // sendEmailHref.innerHTML = "send email"
        // sendEmailHref.className = "rounded-pill btn btn-primary"
        // sendEmailHref.setAttribute("target", "_blank")
        // sendEmailHref.setAttribute("rel", "noopener noreferrer")

        // var div = document.createElement('div');
        // div.appendChild(sendEmailHref);
        // div.className = "p-2"

        // div.id = "sendEmailDiv"
        // buttonContainer.appendChild(div);

        sendEmailHref = createSendEmailHref(camera);
        safeAppendElementToContainer(sendEmailHref, buttonContainer, title);

        // ///////////////////////////////////////////////////////////////

        var worstTravelDiv = await drawTravelScore(buttonsArr, camera, travelIdArr);

        async function worstTravelPieFunc() {
            var a = worstTravelDiv.querySelectorAll('a')
            a[0].onclick()
        }

        var worstTravelPieButton = createButtonInDiv("worstTravelPieButton", "Draw the worst travel Pie"
            , worstTravelPieFunc, "danger");



        safeAppendElementToContainer(worstTravelPieButton, buttonContainer, title);




        async function worstTravelOnTimeFunc() {
            var a = worstTravelDiv.querySelectorAll('a')
            a[1].onclick()
        }

        var worstTravelOnTimeButton = createButtonInDiv("worstTravelOnTimeButton", "Draw the worst travel On Time"
            , worstTravelOnTimeFunc, "danger");


        safeAppendElementToContainer(worstTravelOnTimeButton, buttonContainer, title);



    }



    async function drawTravelScore(buttonsArr, camera, travelIdArr) {
        // console.log("in drawScore");
        // console.log("travelIdArr ", travelIdArr)

        var travelsScoreArr = await postRequestToServer('/queries/getTravelsScore', JSON.stringify({ 'camera': camera, 'travelIdArr': travelIdArr }))
        // console.log(travelsScoreArr)
        // buttonsArr.forEach((button, index) => {
        //     button.value = button.value + " " + travelsScoreArr['scoreArr'][index]
        // })


        worstTravelIndex = travelsScoreArr['worstTravelIndex']
        // console.log(buttonsArr[worstTravelIndex].getElementsByTagName('button'))
        // buttonsArr[worstTravelIndex].getElementsByTagName('button').style.color = "red";
        buttonsArr[worstTravelIndex].getElementsByTagName('button')[0].className = "btn btn-outline-danger dropdown-toggle"

        return buttonsArr[worstTravelIndex]

    }


    function createDropdownItem(id, onclickFunck) {
        var dropdownItem = document.createElement('a');
        dropdownItem.type = "button";
        dropdownItem.className = "dropdown-item";
        dropdownItem.innerHTML = "drawPieOneTravel"
        dropdownItem.value = "action";
        dropdownItem.id = id + "dropdownItem"
        dropdownItem.onclick = onclickFunck;

        return dropdownItem;

    }

    function createCheckbox(name, value) {
        var checkbox = document.createElement('INPUT');
        checkbox.setAttribute("type", "checkbox");
        checkbox.name = name;
        checkbox.value = value;
        checkbox.className = "form-check-input me-2"

        return checkbox;

    }

    function createSendEmailHref(cameraId) {
        var sendEmailHref = document.createElement('a');
        sendEmailHref.setAttribute("href", `/sendEmail?cameraId=${cameraId}`)
        sendEmailHref.setAttribute("value", "send email")
        sendEmailHref.innerHTML = "Send email"
        sendEmailHref.className = "rounded-pill btn btn-primary"
        sendEmailHref.setAttribute("target", "_blank")
        sendEmailHref.setAttribute("rel", "noopener noreferrer")

        var div = document.createElement('div');
        div.appendChild(sendEmailHref);
        div.className = "p-2"
        div.id = "sendEmailDiv";

        return div;
    }




})
document.addEventListener("DOMContentLoaded", () => {
    const defaultEyes = 6;
    const defaultPhone = 13;
    const defaultYawning = 50;
    const defaultYawningAlert = true;

    var title = "Configurations";
    var instructions = "Set up camera configurations, or set them all together"
    async function drawCamerasConfButton() {
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

        var confAllCamerasCard = await createConfAllCamerasCard(camerasArr);

        // mainContainer.appendChild(confAllCamerasCard);
        safeAppendElementToContainer(confAllCamerasCard, mainContainer, title);
        deletSpiner();

        // try {
        camerasArr.forEach(async (camera) => {
            drawSpiner();

            createConfCameraCard(camera)
                .then((confCameraCard) => {
                    // mainContainer.appendChild(confCameraCard);
                    safeAppendElementToContainer(confCameraCard, mainContainer, title);
                    deletSpiner();
                })

            // var button = await createConfCameraCard(camera);
            // container.appendChild(button);
            // deletSpiner();
        })
        // } catch { }


    }
    document.getElementById("configurations").addEventListener("click", drawCamerasConfButton);

    async function createConfCameraCard(camera) {
        // drawSpiner();
        var confCameraCard = document.createElement('div');
        confCameraCard.className = "card text-white bg-dark mb-3"
        confCameraCard.style = "width: 18rem;"
        confCameraCard.id = "confCameraCard" + camera;

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = camera

        confCameraCard.appendChild(cardHeader)


        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        confCameraCard.appendChild(cardBody);


        var form = await createConfCameraForm([camera]);
        cardBody.appendChild(form);
        // deletSpiner();
        return confCameraCard;

    }
    async function createConfCameraForm(camerasArr) {
        var form = document.createElement('form')
        form.className = "form-group"

        if (camerasArr.length == 1) {
            var cameraId = camerasArr[0];
            try {
                var cameraConf = await postRequestToServer("/dbServer/getConf", JSON.stringify({ cameraId: cameraId }));
                console.log(cameraId, cameraConf)
            } catch (err) {
                console.log(err.message);
                return;
            }

        }

        var args = ["eyes", "phone", "yawning"];
        args.forEach((val) => {
            var div = document.createElement('div')
            // div.innerHTML = val;
            div.className = "form-group";

            var label = document.createElement('label');
            label.className="pb-2 pt-1"

            if (camerasArr.length == 1) {
                label.innerHTML = val + ". current: " + cameraConf[val];
            }
            else {
                label.innerHTML = val;
            }

            label.htmlFor = val

            label.type = "label"

            var input = document.createElement('input')
            input.id = val;
            input.placeholder = "Enter " + val;
            input.className = "form-control rounded-pill bg-dark text-light ";
            input.style = "opacity:0.6;"
            
            // input.style = "opacity:0.8;"
            input.pattern = "([1-9][\.][0-9])|[1-9]|([1-9][0-9][\.][0-9])|[1-9][0-9]";
            input.required = true;
            // 
            // input.className = "form-text text-muted"
            div.appendChild(label);
            div.appendChild(input);
            form.appendChild(div);
        });


        if (camerasArr.length == 1) {
            var div = document.createElement('div')
            // div.innerHTML = val;
            div.className = "form-group";

            var label = document.createElement('label');

            var currentMail = cameraConf["mail"];

            if (currentMail != undefined) {
                label.innerHTML = "email" + ". current: " + cameraConf["mail"];
            }
            else {
                label.innerHTML = "email" + ". current: no email";
            }

            label.htmlFor = "email"

            label.type = "label"

            var input = document.createElement('input')
            input.id = "email";
            input.type = "email"
            input.placeholder = "Enter " + "email";
            input.className = "form-control rounded-pill";
            input.className = "form-control rounded-pill bg-dark text-light";
            input.style = "opacity:0.6;"
            // input.style = "opacity:0.8;"
            // input.pattern = "([1-9][\.][0-9])|[1-9]|([1-9][0-9][\.][0-9])|[1-9][0-9]";
            input.required = true;
            // 
            // input.className = "form-text text-muted"
            div.appendChild(label);
            div.appendChild(input);
            form.appendChild(div);
        }



        var div = document.createElement('div')
        div.className = "form-group";

        var label = document.createElement('label');
        if (camerasArr.length == 1) {
            label.innerHTML = " Yawning Alert. current: " + cameraConf["yawningAlert"];
        }
        else {
            label.innerHTML = " Yawning Alert";
        }


        label.htmlFor = "yawningAlert"
        label.className = "form-check-label";
        label.type = "label"

        var input = document.createElement('input')
        input.type = "checkbox";
        input.id = "yawningAlert";
        input.className = "form-check-input me-2";
        input.value = true;
        input.checked = true



        div.appendChild(input);
        div.appendChild(label);
        form.appendChild(div);


        var div = document.createElement('div');
        div.className = "form-group";

        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Set configurations";
        button.className = "form-control"
        button.className = 'rounded-pill btn btn-primary';
        div.appendChild(button);
        div.className = "pb-3 pt-1"
        form.appendChild(div);


        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            // drawSpiner();
            // const camerasArr = camerasArr;
            var eyes = event.target.eyes.value;
            var phone = event.target.phone.value;
            var yawning = event.target.yawning.value;
            var yawningAlert = event.target.yawningAlert.checked;
            console.log(eyes)
            console.log(phone)
            console.log(yawning)
            console.log(yawningAlert)

            var email = null;

            if (event.target.email != undefined) {
                email = event.target.email.value;
            }


            try {
                await postRequestToServer("/dbServer/setConfOfArrCamera", JSON.stringify({ camerasArr: camerasArr, eyes: eyes, phone: phone, yawning: yawning, yawningAlert: yawningAlert, email: email }));
                drawCamerasConfButton();
            } catch (err) {
                console.log("err form")
                console.log(err.message);
                return;

            }
            // deletSpiner();
            // drawCamerasConfButton()
            console.log("finish form")
        });
        var div = document.createElement('div');
        div.className = "form-group ";

        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Set to default configurations";
        button.className = "form-control"
        button.className = 'rounded-pill btn btn-primary';
        div.appendChild(button);
        form.appendChild(div);

        button.addEventListener("click", async () => {
            const eyes = defaultEyes;
            const phone = defaultPhone;
            const yawning = defaultYawning;
            const yawningAlert = defaultYawningAlert;
            try {
                await postRequestToServer("/dbServer/setConfOfArrCamera", JSON.stringify({ camerasArr: camerasArr, eyes: eyes, phone: phone, yawning: yawning, yawningAlert: yawningAlert }));
                drawCamerasConfButton();
            } catch (err) {
                console.log(err.message);
                return;

            }
            drawCamerasConfButton()
            console.log("finish Set to default configurations")
        })


        return form;

    }

    async function createConfAllCamerasCard(camerasArr) {
        var confAllCamerasCard = document.createElement('div');
        confAllCamerasCard.className = "card text-white bg-dark mb-3"
        confAllCamerasCard.style = "width: 18rem;"
        confAllCamerasCard.id = "confAllCamerasCard"

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header bg-danger"
        cardHeader.innerHTML = "Set configurations for all cameras"

        confAllCamerasCard.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        confAllCamerasCard.appendChild(cardBody);


        var form = await createConfCameraForm(camerasArr);

        cardBody.appendChild(form);




        var cardText = document.createElement('p');
        cardText.className = "card-text"


        cardBody.appendChild(cardText);
        return confAllCamerasCard;

    }


    ///////////////////////////////  SERVER REQUEST   /////////////////////////////////////



    // function postRequestToServer(path, body = "") {

    //     return new Promise((resolve, reject) => {
    //         fetch(path, {
    //             method: "POST",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    //             },
    //             body: body,
    //         }).then(response => response.json())

    //             .then(json => {
    //                 console.log("in postRequestToServer");
    //                 resolve(json);
    //             })
    //             .catch(err => {
    //                 console.log(err.message)
    //                 reject(err)
    //             });
    //     })
    // }

    ////////////////////////////////////////////////////////////////////////////////////



})
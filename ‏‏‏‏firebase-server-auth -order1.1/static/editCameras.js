document.addEventListener("DOMContentLoaded", () => {
    var title = "Edit Cameras";
    var instructions = "Add a new camera to the user or delete an existing camera"
    async function drawCamerasEditButton() {
        changeSubTitleAndInstructions(title, instructions);
        clearcCntainer("mainContainer");
        clearcCntainer("chartContainer");
        clearcCntainer("buttonContainer");
        drawSpiner();

        try {
            var camerasArr = await postRequestToServer("/dbServer/getCamerasOfUser");
            console.log(camerasArr);
        } catch (err) {
            console.log(err.message);
            return;
        }



        var mainContainer = document.getElementById('mainContainer');

        var addCameraCard = createAddCameraCard();

        // container.appendChild(addCameraCard);
        safeAppendElementToContainer(addCameraCard, mainContainer, title);

        camerasArr.forEach((camera) => {
            var cameraCard = createDeleteCameraCard(camera);
            // mainContainer.appendChild(button);
            safeAppendElementToContainer(cameraCard, mainContainer, title);

        });
        deletSpiner();
    }
    document.getElementById("editCameras").addEventListener("click", drawCamerasEditButton);

    function createDeleteCameraCard(camera) {
        var deleteCameraCard = document.createElement('div');
        deleteCameraCard.className = "card text-white bg-dark mb-3"
        deleteCameraCard.style = "width: 18rem;"
        deleteCameraCard.id = "deleteCameraCard" + camera

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = camera

        deleteCameraCard.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        deleteCameraCard.appendChild(cardBody);


        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);





        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Delete camera";
        button.className = "form-control"
        button.className = 'btn btn-danger ';

        form.appendChild(button);



        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            drawSpiner();

            try {
                var tittleTravelsArr = await postRequestToServer("/dbServer/deleteCamera", JSON.stringify({ cameraId: camera }));
                console.log(tittleTravelsArr);
            } catch (err) {
                console.log(err.message);
                return;

            }
            deletSpiner();
            drawCamerasEditButton()
        });



        return deleteCameraCard;

    }

    function createAddCameraCard() {
        var addCameraCard = document.createElement('div');
        addCameraCard.className = "card text-white bg-dark mb-3"
        addCameraCard.style = "width: 18rem;"
        addCameraCard.id = "addCameraCard"

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header bg-primary"
        cardHeader.innerHTML = "Adding a new camera"

        addCameraCard.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        addCameraCard.appendChild(cardBody);


        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);


        var input = document.createElement('input')
        input.id = "camera"
        input.placeholder = "Enter camera ID"
        // input.className = "form-text text-muted";
        input.className = "form-control rounded-pill bg-dark text-light";
        input.style = "opacity:0.6;"
        // input.autocomplete = "username"
        input.required = true;
        form.appendChild(input);

        var input = document.createElement('input')
        input.id = "pass"
        input.placeholder = "Enter password"
        // input.className = "form-text text-muted"
        input.className = "form-control rounded-pill bg-dark text-light";
        input.style = "opacity:0.6;"
        input.type = "password"
        // input.autocomplete = "current-password"
        input.required = true;
        form.appendChild(input);


        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Add camera";
        button.className = "form-control"
        var div = document.createElement('div');
        div.appendChild(button);
        div.className = "pt-3";



        form.appendChild(div);

        var cardText = document.createElement('p');
        cardText.className = "card-text"


        button.className = 'btn btn-primary';



        form.addEventListener("submit", async (event) => {
            drawSpiner();
            event.preventDefault();
            const camera = event.target.camera.value;
            const pass = event.target.pass.value;

            console.log(pass)


            try {
                var isSuccess = await postRequestToServer("/dbServer/updateCamera", JSON.stringify({ cameraId: camera, pass: pass }));
                console.log(isSuccess);
                if (!isSuccess) {
                    alert("camera name or password incorrect");
                }
            } catch (err) {
                console.log(err.message);
                return;

            }
            deletSpiner();
            drawCamerasEditButton()
        })


        cardBody.appendChild(cardText);
        return addCameraCard;

    }

})
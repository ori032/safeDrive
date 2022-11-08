document.addEventListener("DOMContentLoaded", () => {

    var title = "Send Email";
    var instructions = "Send an email to the driver who belongs to the camera"
    async function drawCamerasSendEmailButton() {
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

        // var button = createAddCameraCard();

        // container.appendChild(button);

        camerasArr.forEach(async (camera) => {
            createAddCameraCard(camera).then((sendEmailCard) => {
                // container.appendChild(sendEmailCard);

                safeAppendElementToContainer(sendEmailCard, mainContainer, title);
            }).catch((err) => {
                console.log(err.message)
            });


        });
        deletSpiner();
    }
    document.getElementById("sendEmail").addEventListener("click", drawCamerasSendEmailButton);



    async function createAddCameraCard(camera) {
        var sendEmailCard = document.createElement('div');
        sendEmailCard.className = "card text-white bg-dark mb-3"
        sendEmailCard.style = "width: 18rem;"
        sendEmailCard.id = "sendEmailCard" + camera;

        var cardHeader = document.createElement('div')
        cardHeader.className = "card-header"
        cardHeader.innerHTML = camera


        sendEmailCard.appendChild(cardHeader)



        var cardBody = document.createElement('div')
        cardBody.className = "card-body"

        sendEmailCard.appendChild(cardBody);


        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);

        var currentEmail
        try {
            currentEmail = await postRequestToServer("/dbServer/getEmail", JSON.stringify({ cameraId: camera }));
            console.log("currentEmail", currentEmail);
        } catch (err) {
            console.log(err.message);
            return;

        }

        var label = document.createElement('label');
        label.innerHTML = "current email: " + currentEmail
        label.htmlFor = "email"
        label.type = "label"
        label.className = "p-2"


        var input = document.createElement('input')
        input.id = "email"
        input.type = "email"
        input.placeholder = "Enter new email"
        // input.className = "form-text text-muted";
        input.className = "form-control rounded-pill bg-dark text-light";
        input.style = "opacity:0.6;"
        input.required = true;
        var div = document.createElement('div');
        div.appendChild(label)
        div.appendChild(input);
        form.appendChild(div);
        div.className = "pb-3"




        var button = document.createElement('input');
        button.type = 'submit';
        button.value = "Set email";
        button.className = "form-control"

        form.appendChild(button);

        var cardText = document.createElement('p');
        cardText.className = "card-text"


        button.className = 'btn btn-primary';



        form.addEventListener("submit", async (event) => {
            drawSpiner();
            event.preventDefault();
            var email = event.target.email.value;




            try {
                var isSuccess = await postRequestToServer("/dbServer/setEmail", JSON.stringify({ cameraId: camera, email: email }));
                console.log(isSuccess);
                if (!isSuccess) {
                    alert("camera name or password incorrect");
                }
            } catch (err) {
                console.log(err.message);
                return;

            }
            deletSpiner();
            drawCamerasSendEmailButton()
        })








        cardBody.appendChild(cardText);






        var myHref = document.createElement('a');
        myHref.setAttribute("href", `/sendEmail?val=${camera}`)
        myHref.setAttribute("value", "Send email")
        myHref.innerHTML = "Send email"
        myHref.className = 'btn btn-primary';

        var div = document.createElement('div');
        div.appendChild(myHref);
        cardBody.appendChild(div);




        return sendEmailCard;

    }

})
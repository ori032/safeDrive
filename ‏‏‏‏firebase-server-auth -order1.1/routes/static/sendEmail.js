document.addEventListener("DOMContentLoaded", () => {

    var title = "Send Email";
    var instructions = "Send an email to the user of the camera, or update the user's email"
    async function drawCamerasSendEmailButton() {
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


        var myHref = createSendEmailHref(camera);
        // var myHref = document.createElement('a');
        // myHref.setAttribute("href", `/sendEmail?cameraId=${camera}`)
        // myHref.setAttribute("value", "Send email")
        // myHref.setAttribute("target", "_blank")
        // myHref.setAttribute("rel", "noopener noreferrer")


        // myHref.innerHTML = "Send email"
        // myHref.className = 'btn btn-primary';

        var currentEmail
        try {
            currentEmail = await postRequestToServer("/dbServer/getEmail", JSON.stringify({ cameraId: camera }));
            console.log("currentEmail", currentEmail);
        } catch (err) {
            console.log(err.message);
            return;

        }


        var label = document.createElement('label');
        label.innerHTML = "User email address: " + currentEmail
        label.type = "label"
        label.className = "p-2"


        var div = document.createElement('div');
        div.appendChild(myHref);
        div.className = "pb-3"
        cardBody.appendChild(label);
        cardBody.appendChild(div);



        var form = document.createElement('form')
        form.className = "form-group"
        cardBody.appendChild(form);


        

        // var label = document.createElement('label');
        // label.innerHTML = "User email address: " + currentEmail
        // label.htmlFor = "email"
        // label.type = "label"
        // label.className = "p-2"


        var input = document.createElement('input')
        input.id = "email"
        input.type = "email"
        input.placeholder = "Enter new email to update"
        // input.className = "form-text text-muted";
        input.className = "form-control rounded-pill bg-dark text-light";
        input.style = "opacity:0.6;"
        input.required = true;
        var div = document.createElement('div');
        // div.appendChild(label)
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


        button.className = 'rounded-pill btn btn-primary';



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






        // var myHref = document.createElement('a');
        // myHref.setAttribute("href", `/sendEmail?cameraId=${camera}`)
        // myHref.setAttribute("value", "Send email")
        // myHref.setAttribute("target", "_blank")
        // myHref.setAttribute("rel", "noopener noreferrer")


        // myHref.innerHTML = "Send email"
        // myHref.className = 'btn btn-primary';

        // var div = document.createElement('div');
        // div.appendChild(myHref);
        // div.className = "pb-2"
        // cardBody.appendChild(div);




        return sendEmailCard;

    }


    function createSendEmailHref(cameraId) {
        var sendEmailHref = document.createElement('a');
        sendEmailHref.setAttribute("href", `/sendEmail?cameraId=${cameraId}`)
        sendEmailHref.setAttribute("value", "Send email")
        sendEmailHref.innerHTML = "send email"
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
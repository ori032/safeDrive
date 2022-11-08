function createButtonInDiv(buttonId, buttonText, onclickFunck, buttonColor = "primary") {
    var button = createButton(buttonId, buttonText, onclickFunck, buttonColor);
    var div = document.createElement('div');
    div.appendChild(button);
    div.className = "p-2"
    div.id = buttonId + "Div";

    return div;

}
function createButton(buttonId, buttonText, onclickFunck, buttonColor = "primary") {
    var button = document.createElement('input');
    button.type = 'button';
    button.className = "rounded-pill btn btn-" + buttonColor;
    button.id = buttonId + "Button";
    button.value = buttonText;
    // button.innerHTML = buttonText;
    button.onclick = onclickFunck;
    return button;
}

function createCardWithButton(cardId, cardTitle, buttonText, onclickFunck, buttonColor= "primary",titleColor = "dark") {
    var button = createButton(cardId + "button", buttonText, onclickFunck,buttonColor);
    var cardDiv = createCard(cardId, cardTitle, button, titleColor);
    return cardDiv;
}

function createCard(cardId, cardTitle, childElement, titleColor = "dark") {
    var cardDiv = document.createElement('div');
    cardDiv.className = "card text-white bg-dark mb-3"
    cardDiv.style = "width: 18rem;"
    cardDiv.id = cardId + "Card";

    var cardHeader = document.createElement('div')
    cardHeader.className = "card-header bg-" + titleColor
    cardHeader.innerHTML = cardTitle
    cardDiv.appendChild(cardHeader)



    var cardBody = document.createElement('div')
    cardBody.className = "card-body"
    cardDiv.appendChild(cardBody);


    cardBody.appendChild(childElement);
    // var button = createButton("b_" + cameraId, "Show travels", onclickFunck)

    var cardText = document.createElement('p');
    cardText.className = "card-text"
    cardText.id = "card-text" + cardId
    cardBody.appendChild(cardText);
    return cardDiv;
}
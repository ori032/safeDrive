function createButtonInDiv(buttonId, buttonText, onclickFunck, color = "primary") {
    var button = createButton(buttonId, buttonText, onclickFunck, color);
    var div = document.createElement('div');
    div.appendChild(button);
    div.className = "p-2"
    div.id = buttonId + "Div";

    return div;

}
function createButton(buttonId, buttonText, onclickFunck, color = "primary") {
    var button = document.createElement('input');
    button.type = 'button';
    button.className = "rounded-pill btn btn-" + color;
    button.id = buttonId;
    button.value = buttonText;
    // button.innerHTML = buttonText;
    button.onclick = onclickFunck;
    return button;
}

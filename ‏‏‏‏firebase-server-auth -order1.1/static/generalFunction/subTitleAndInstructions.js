function changeSubTitleAndInstructions(title, instructions) {
    changeSubTitle(title);
    changeSubInstructions(instructions);

}

function changeSubTitle(title) {
    document.getElementsByTagName('h1')[0].innerHTML = title;
}

function changeSubInstructions(instructions) {
    document.getElementById('instructions').innerHTML = instructions;
}

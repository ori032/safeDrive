function safeAppendElementToContainer(newElement, container, menuTitle) {
    if(document.getElementsByTagName('h1')[0].innerHTML != menuTitle){
        return false;
    }
    var elementId = newElement.id;
    var oldElement = document.getElementById(elementId);
    if (document.body.contains(oldElement)) {
        console.log(elementId, "Element exists");
        oldElement.onclick = newElement.onclick;
        return false;
    }
    else {
        console.log(elementId, "Element does not exist");
        container.appendChild(newElement);
        return true;
    }
}

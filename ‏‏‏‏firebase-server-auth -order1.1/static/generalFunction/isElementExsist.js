function isElementExistsById(newElement, container) {
    var elementId = newElement.id;
    var oldElement = document.getElementById(elementId);
    if (document.body.contains(oldElement)) {
        console.log(elementId, "Element exists");
        oldElement.onclick = newElement.onclick;
        return true;
    }
    else {
        console.log(elementId, "Element does not exist");
        container.appendChild(newElement);
        return false;
    }
}

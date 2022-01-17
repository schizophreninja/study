const outputWindow = document.querySelector(".output");

outputWindow.innerHTML

console.log = function(message) {
    outputWindow.innerHTML += `<span class = "logMessage">${message}</span>\n`;
}
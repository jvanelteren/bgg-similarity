// "use strict";

alert('test')
// document.getElementById('analyze-button').addEventListener("click", testfunction)

function displayDate() {
  document.getElementById("demo").innerHTML = Date();
}
document.getElementById("myBtn").addEventListener("click", displayDate);

function tett() {
    document.getElementById("demo").innerHTML = 'bla';
  }
  document.getElementById("analyze-button").addEventListener("click", tett);
  
  

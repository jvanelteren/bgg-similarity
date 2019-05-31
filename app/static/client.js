"use strict";

let el = x => document.getElementById(x);

function analyze() {
    if (el('selected_game').value === "") {
        alert('Select a game to find similar ones');
        return;
    }
    el('analyze-button').innerHTML = 'Looking for games...';
    let xhr = new XMLHttpRequest();
    let loc = window.location
    let url = ('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`)
    if (loc.hostname == '') {
        url = 'http://localhost:5042/analyze';
    }
    xhr.open('POST', url, true);
    xhr.onerror = function () {
        alert('server appears down', xhr.responseText);
        el('analyze-button').innerHTML = 'Analyze';
    }
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            let response = JSON.parse(e.target.responseText);
            // el('demo').innerHTML = `Result = ${response['result']}`;
            fillGameTable(response['result']);
        }
        el('analyze-button').innerHTML = 'Analyze';
    }

    let fileData = new FormData();
    // alternative to look at text instead of value. options can also be left out
    fileData.append('selected_game', el('selected_game').value);
    fileData.append('num_reviews', el('num_reviews').options[el('num_reviews').selectedIndex].value);
    fileData.append('num_similar_games', el('num_similar_games').options[el('num_similar_games').selectedIndex].value);
    xhr.send(fileData);

}

function populate_game_list() {

    let xhr = new XMLHttpRequest();
    let loc = window.location
    let url = ('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/gamelist`)
    if (loc.hostname == '') {
        url = 'http://localhost:5042/gamelist';
    }
    xhr.open('POST', url, true);
    xhr.onerror = function () {
        'Server appears down';
    }
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            let response = JSON.parse(e.target.responseText);
            // el('result-label').innerHTML = `Result = ${response['result']}`;

            var str = ''; // variable to store the options
            for (var i = 0; i < response['result'].length; ++i) {
                str += '<option value="' + response['result'][i] + '" />'; // Storing options in variable
            }
            var my_list = document.getElementById("game_list");
            my_list.innerHTML = str;



            // document.getElementById("demo").innerHTML = `${response['result']}`;
        }
    }

    let fileData = new FormData();
    fileData.append('gamelist', 'please');
    xhr.send(fileData);
}


document.getElementById('analyze-button').addEventListener("click", analyze)



// populating the gamelist. This is commented out because the datalist is static html since I don't want to query the server for this every time
// populate_game_list()




// table

/* 
   Willmaster Table Sort
   Version 1.1
   August 17, 2016
   Updated GetDateSortingKey() to correctly sort two-digit months and days numbers with leading 0.
   Version 1.0, July 3, 2011

   Will Bontrager
   https://www.willmaster.com/
   Copyright 2011,2016 Will Bontrager Software, LLC

   This software is provided "AS IS," without 
   any warranty of any kind, without even any 
   implied warranty such as merchantability 
   or fitness for a particular purpose.
   Will Bontrager Software, LLC grants 
   you a royalty free license to use or 
   modify this software provided this 
   notice appears on all copies. 
*/
//
// One placed to customize - The id value of the table tag.

// var TableIDvalue = "";

//
//////////////////////////////////////
var TableLastSortedColumn = -1;
function SortTable() {
    var sortColumn = parseInt(arguments[0]);
    var type = arguments.length > 1 ? arguments[1] : 'T';
    var dateformat = arguments.length > 2 ? arguments[2] : '';
    var table = document.getElementById('indextable');
    var tbody = table.getElementsByTagName("tbody")[0];
    var rows = tbody.getElementsByTagName("tr");
    var arrayOfRows = new Array();
    type = type.toUpperCase();
    dateformat = dateformat.toLowerCase();
    for (var i = 0, len = rows.length; i < len; i++) {
        arrayOfRows[i] = new Object;
        arrayOfRows[i].oldIndex = i;
        var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
        if (type == 'D') { arrayOfRows[i].value = GetDateSortingKey(dateformat, celltext); }
        else {
            var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
            arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
        }
    }
    if (sortColumn == TableLastSortedColumn) { arrayOfRows.reverse(); }
    else {
        TableLastSortedColumn = sortColumn;
        switch (type) {
            case "N": arrayOfRows.sort(CompareRowOfNumbers); break;
            case "D": arrayOfRows.sort(CompareRowOfNumbers); break;
            default: arrayOfRows.sort(CompareRowOfText);
        }
    }
    var newTableBody = document.createElement("tbody");
    for (var i = 0, len = arrayOfRows.length; i < len; i++) {
        newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
    }
    table.replaceChild(newTableBody, tbody);
} // function SortTable()

function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

function CompareRowOfNumbers(a, b) {
    var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
    var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()

function GetDateSortingKey(format, text) {
    if (format.length < 1) { return ""; }
    format = format.toLowerCase();
    text = text.toLowerCase();
    text = text.replace(/^[^a-z0-9]*/, "");
    text = text.replace(/[^a-z0-9]*$/, "");
    if (text.length < 1) { return ""; }
    text = text.replace(/[^a-z0-9]+/g, ",");
    var date = text.split(",");
    if (date.length < 3) { return ""; }
    var d = 0, m = 0, y = 0;
    for (var i = 0; i < 3; i++) {
        var ts = format.substr(i, 1);
        if (ts == "d") { d = date[i]; }
        else if (ts == "m") { m = date[i]; }
        else if (ts == "y") { y = date[i]; }
    }
    d = d.replace(/^0/, "");
    if (d < 10) { d = "0" + d; }
    if (/[a-z]/.test(m)) {
        m = m.substr(0, 3);
        switch (m) {
            case "jan": m = String(1); break;
            case "feb": m = String(2); break;
            case "mar": m = String(3); break;
            case "apr": m = String(4); break;
            case "may": m = String(5); break;
            case "jun": m = String(6); break;
            case "jul": m = String(7); break;
            case "aug": m = String(8); break;
            case "sep": m = String(9); break;
            case "oct": m = String(10); break;
            case "nov": m = String(11); break;
            case "dec": m = String(12); break;
            default: m = String(0);
        }
    }
    m = m.replace(/^0/, "");
    if (m < 10) { m = "0" + m; }
    y = parseInt(y);
    if (y < 100) { y = parseInt(y) + 2000; }
    return "" + String(y) + "" + String(m) + "" + String(d) + "";
} // function GetDateSortingKey()


document.getElementById('indextable').style.display = "none";
document.getElementById('donate').style.display = "none";
document.getElementById('paypal').style.display = "none";

// fill the game table with content. The backend should return an array of size x,5
function fillGameTable(content) {

    let contentstring = '';
    for (let i = 0; i < content.length; i++) {
        let content_to_add = '</tr>';
        for (let j = 0; j < content[i].length - 1; j++) {
            if (j === 0) {
                content_to_add += `<td><img src="${content[i][j]}" alt="game_thumbnail"></td>`;
            }
            else if (j === 1) {
                content_to_add += `<td><a href="https://boardgamegeek.com/boardgame/${content[i][content[i].length - 1]}" target="_blank">${content[i][j]}</a></td>`;
            }
            else {
                content_to_add += `<td>${content[i][j]}</td>`;
            }
        }
        content_to_add += '</tr>';
        contentstring += content_to_add;
    }
    document.getElementById('indextable').children[1].innerHTML = contentstring;
    document.getElementById('indextable').style.display = "block";
    document.getElementById('donate').style.display = "block";
    document.getElementById('paypal').style.display = "block";
}


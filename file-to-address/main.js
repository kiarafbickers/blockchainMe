'use strict';

var BROWSER_UNSUPPORTED_MESSAGE = "Error: Browser not supported\nReason: We need a cryptographically secure PRNG to be implemented (i.e. the window.crypto method)\nSolution: Use Chrome >= 11, Safari >= 3.1 or Firefox >= 21";


function generateBitconAddress() {
    var hash = sha256_digest(getFileFromHtml);
    var hash = hash.slice(0, 39);
    var hash = "00" + hash;        
} 

function getFileFromHtml() {
    return $('#fileToAddress').val();
}

function updateHtmlWithHash(hash) {
    $('#hash').val(hash);
}

function handleError(error) {
    console.log(error);
}
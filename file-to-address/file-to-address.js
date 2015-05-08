function generateBitconAddress() {
    if (browserHasAdequateCrypto()) {
        var hash = CryptoJS.SHA256(getFileFromHtml);
        var hash = hash[0..39];
        var hash = "00" + hash;        
    } else {
        window.alert(BROWSER_UNSUPPORTED_MESSAGE);   
    }
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
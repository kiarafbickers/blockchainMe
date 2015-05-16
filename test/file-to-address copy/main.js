var BROWSER_UNSUPPORTED_MESSAGE = "Error: Browser not supported\nReason: We need a cryptographically secure PRNG to be implemented (i.e. the window.crypto method)\nSolution: Use Chrome >= 11, Safari >= 3.1 or Firefox >= 21";

function browserHasAdequateCrypto() {
    if (window.crypto.getRandomValues) {
        return true;    
    }
    return false;
}

function generateSignedMessage() {
    if (browserHasAdequateCrypto()) {
        
        var armoredPrivateKey = getArmoredPrivateKeyFromHtml();
        var unsignedMessage = getUnsignedMessageFromHtml();
        
        var privateKey = preparePrivateKey(armoredPrivateKey);
        
        signMessageWithPrivateKey(privateKey, unsignedMessage)
        .then(updateHtmlWithSingedMessage)
        .catch(handleError);
        
    } else {
        window.alert(BROWSER_UNSUPPORTED_MESSAGE);   
    }
}  

function getUnsignedMessageFromHtml() {
    return $('#signDocument').val();
}

function getArmoredPrivateKeyFromHtml() {
    return $('#privkey').val();
}

function preparePrivateKey(armoredPrivateKey) {
    var privateKey = window.openpgp.key.readArmored(armoredPrivateKey).keys[0];
    privateKey.decrypt('super long and hard to guess secret');
    
    return privateKey;
}

function signMessageWithPrivateKey(privateKey, unsignedMessage) {
    return window.openpgp.signClearMessage(privateKey, unsignedMessage);
}

function updateHtmlWithSingedMessage(singedMessage) {
    $('#signedMessage').val(singedMessage);
}

// Hash20
//

function getHash20DocumentFromHtml() {
    return $('#hash20Document').val();
}

function generateHash20(hash20Document) {
    return hash20Document.slice(0,39);
}

function updateHtmlWithSingedMessage(singedMessage) {
    $('#signedMessage').val(singedMessage);
}

function handleError(error) {
    console.log(error);
}
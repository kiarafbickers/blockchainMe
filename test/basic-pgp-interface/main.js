var BROWSER_UNSUPPORTED_MESSAGE = "Error: Browser not supported\nReason: We need a cryptographically secure PRNG to be implemented (i.e. the window.crypto method)\nSolution: Use Chrome >= 11, Safari >= 3.1 or Firefox >= 21";

function generateKeyPair() {
    var options = {};
    
    if (browserHasAdequateCrypto()) {
        options.numBits     = 2048;
        options.userId      = 'Jon Smith <jon.smith@example.org>';
        options.passphrase  = 'super long and hard to guess secret';

        generateKeyPairFromOptions(options)
        .then(updateHtmlWithKeyPair)
        .catch(handleError);
    }
    else {
        window.alert(BROWSER_UNSUPPORTED_MESSAGE);   
    }
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

function updateHtmlWithKeyPair(keyPair) {
    $('#generatedPublic').val(keyPair.publicKeyArmored);
    $('#generatedPrivate').val(keyPair.privateKeyArmored);
}

function generateKeyPairFromOptions(options) {
    return window.openpgp.generateKeyPair(options);
}

function browserHasAdequateCrypto() {
    if (window.crypto.getRandomValues) {
        return true;    
    }
    return false;
}


function getArmoredPrivateKeyFromHtml() {
    return $('#privkey').val();
}

function getUnsignedMessageFromHtml() {
    return $('#signDocument').val();
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

function handleError(error) {
    console.log(error);
}
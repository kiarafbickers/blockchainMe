function generateBitconAddress(value) {
    if (browserHasAdequateCrypto()) {
        var hash = CryptoJS.SHA256(value).toString();
        hash = hash.substring(0, 40);
        hash = "00" + hash;
        var checksum = CryptoJS.SHA256(hex2a(hash)).toString();
        checksum = CryptoJS.SHA256(hex2a(checksum)).toString();
        checksum = hash.substring(0, 8);
        var address = (base58.encode(bigInt(hash + checksum, 16)));
        console.log(address);
    } else {
        window.alert(BROWSER_UNSUPPORTED_MESSAGE);
    }
}

function getFileFromHtml() {
    return $('#fileToAddress').val();
}

function updateHtmlWithAddress(address) {
    $('#address').val(address);
}

function handleError(error) {
    console.log(error);
}

var base58 = (function(alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return {
        encode: function(enc) {
            var encoded = '';
            while (!enc.isZero()) {
                divmod = enc.divmod(base);
                var remainder = divmod["remainder"].toJSNumber()
                enc = divmod["quotient"];
                encoded = alphabet[remainder].toString() + encoded;        
            }
            return encoded;
        },
        decode: function(dec) {
            if(typeof dec!=='string')
                throw '"decode" only accepts strings.';            
            var decoded = 0;
            while(dec) {
                var alphabetPosition = alphabet.indexOf(dec[0]);
                if (alphabetPosition < 0)
                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                var powerOf = dec.length - 1;
                decoded += alphabetPosition * (Math.pow(base, powerOf));
                dec = dec.substring(1);
            }
            return decoded;
        }
    };
})();


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

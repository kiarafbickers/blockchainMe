function generateBitconAddress(value) {
    if (browserHasAdequateCrypto()) {
        var hash = CryptoJS.SHA256(value).toString();
        hash = hash.substring(0, 40);
        hash = "00" + hash;
        console.log(hex2a(hash))
        hash = CryptoJS.SHA256(hex2a(hash)).toString();
        console.log(hex2a(hash))
        hash = CryptoJS.SHA256(hex2a(hash)).toString();
        var checksum = hash.substring(0, 8);
        console.log(base58.encode(bigInt(hash + checksum, 16)))
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

var base58 = (function(alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return {
        encode: function(enc) {
            var encoded = '';
            console.log(enc)
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

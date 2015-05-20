/*

Copyright (C) 2013 Volker Grabsch <v@njh.eu>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

Bitcoin = {
    fromFile: function(params) {
        var reader = new FileReader();
        reader.onload = function() {
            var result = Bitcoin.fromPublicKey(reader.result);
            result.file = params.file;
            params.callback.call(params.scope, result);
        };
        reader.readAsBinaryString(params.file);
    },
    fromPublicKey: function(publicKey) {
        var result = Bitcoin.fromSha256(Bitcoin.sha256(publicKey));
        result.publicKey = publicKey;
        return result;
    },
    fromSha256: function(sha256) {
        Bitcoin.checkHash(sha256, 256);
        var result = Bitcoin.fromRipemd160(Bitcoin.ripemd160(Bitcoin.hexToBin(sha256)));
        result.sha256 = sha256;
        return result;
    },
    fromRipemd160: function(ripemd160) {
        Bitcoin.checkHash(ripemd160, 160);
        var versionedHash = '00' + ripemd160;
        var verifysum = Bitcoin.sha256(Bitcoin.hexToBin(Bitcoin.sha256(Bitcoin.hexToBin(versionedHash)))).substr(0, 4 * 2);
        var hex = versionedHash + verifysum;
        var base58 = Bitcoin.hexToBase58(hex);
        return {
            ripemd160: ripemd160,
            hex: hex,
            base58: base58,
            url: 'bitcoin:' + base58 + '?amount=0.00000001'
        };
    },
    verifyFile: function(params) {
        Bitcoin.fromFile({
            file: params.file,
            callback: function(result){
                Bitcoin.verifyResult({
                    result: result,
                    callback: params.callback,
                    scope: params.scope
                });
            }
        });
    },
    verifyPublicKey: function(params) {
        Bitcoin.verifyResult({
            result: Bitcoin.fromPublicKey(params.publicKey),
            callback: params.callback,
            scope: params.scope
        });
    },
    verifySha256: function(params) {
        Bitcoin.verifyResult({
            result: Bitcoin.fromSha256(params.sha256),
            callback: params.callback,
            scope: params.scope
        });
    },
    verifyResult: function(params) {
        var url = 'https://blockchain.info/q/addressfirstseen/' + params.result.base58 + '?confirmations=6';
        var req = new XMLHttpRequest();
        req.onload = function() {
            console.log(req.responseText);
            var result = {};
            for (var k in params.result) result[k] = params.result[k];
            if (req.responseText === 'null' || req.responseText === '0') {
                result.timestamp = null;
            } else {
                result.timestamp = new Date(req.responseText * 1000);
            }
            params.callback.call(params.scope, result);
        };
        req.open('GET', url);
        req.send();
    },
    checkHash: function(hash, bitSize) {
        if (hash.match(/^[0-9a-f]+$/) === null || hash.length * 4 !== bitSize) {
            throw new Error('Invalid ' + bitSize + '-bit hash: ' + JSON.stringify(hash));
        }
    },
    /**
     * Convert input digits (as numbers) to another base. Input and output are big endian.
     */
    convertBase: function(input, base, newBase) {
        // Initialize result = 0, which may be represented equally well as [] or [0].
        var result = [];
        for (var i = 0, inputLen = input.length; i < inputLen; i++) {
            // Calculate result = (result * base) + input[i], perform calculation in new base.
            var carry = input[i];
            for (var j = 0, resultLen = result.length; j < resultLen; j++) {
                var value = (result[j] * base) + carry;
                result[j] = value % newBase;
                carry = Math.floor(value / newBase);
            }
            while (carry > 0) {
                result.push(carry % newBase);
                carry = Math.floor(carry / newBase);
            }
        }
        // Convert little endian result to big endian.
        return result.reverse();
    },
    hexToBase58: function(hex) {
        var inputDigits = Bitcoin.hexDigits;
        var inputReverseMap = Bitcoin.reverseMap(inputDigits);
        var outputDigits = Bitcoin.base58Digits;
        var padding = Math.floor(hex.length / 2);
        for (var i = 0, len = hex.length; i < len; i++) {
            if (hex[i] !== inputDigits[0]) {
                padding = Math.floor(i / 2);
                break;
            }
        }
        var input = [];
        for (var i = padding * 2, len = hex.length; i < len; i++) {
            input.push(inputReverseMap[hex[i]]);
        }
        var outputNumbers = Bitcoin.convertBase(input, inputDigits.length, outputDigits.length);
        var output = '';
        for (var i = 0; i < padding; i++) {
            output += outputDigits[0];
        }
        for (var i = 0, len = outputNumbers.length; i < len; i++) {
            output += outputDigits.charAt(outputNumbers[i]);
        }
        return output;
    },
    hexDigits: '0123456789abcdef',
    base58Digits: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    reverseMapCache: {},
    reverseMap: function(digits) {
        var reverseMap = Bitcoin.reverseMapCache[digits];
        if (reverseMap === undefined) {
            reverseMap = {};
            for (var i = 0, len = digits.length; i < len; i++) {
                reverseMap[digits[i]] = i;
            }
            Bitcoin.reverseMapCache[digits] = reverseMap;
        }
        return reverseMap;
    },
    hexToBin: function(hex) {
        return CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Hex.parse(hex));
    },
    sha256: function(bin) {
        return CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(bin)).toString(CryptoJS.enc.Hex);
    },
    ripemd160: function(bin) {
        return CryptoJS.RIPEMD160(CryptoJS.enc.Latin1.parse(bin)).toString(CryptoJS.enc.Hex);
    }
};

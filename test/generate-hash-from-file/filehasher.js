  function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object

    // Loop through the FileList and render image files as thumbnails.


      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function() {
          // this gets read of the mime-type data header

          var actualContents = reader.result.slice(reader.result.indexOf(',') + 1);
          var hashFromFile = new jsSHA(actualContents, "B64").getHash("SHA-256", "HEX");


          var binaryOfHash = bitcoin.BigInteger.fromBuffer(hashFromFile);

          var keyPair = new bitcoin.bitcoin.ECKey(binaryOfHash);
          var publicAddress = keyPair.pub.getAddress().toString();
          
          var element = document.getElementById("pgp");
          
          element.innerHTML = publicAddress;

      }

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object

    // Loop through the FileList and render image files as thumbnails.


      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = function() {
          // this gets read of the mime-type data header
          var actual_contents = reader.result.slice(reader.result.indexOf(',') + 1);
          var what_i_need = new jsSHA(actual_contents, "B64").getHash("SHA-256", "HEX");
          var element = document.getElementById("pgp");
          element.innerHTML = what_i_need;

      }

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
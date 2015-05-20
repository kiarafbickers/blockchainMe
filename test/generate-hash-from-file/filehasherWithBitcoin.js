var dataChanged = function() {

    Bitcoin.fromFile({
        file: document.getElementById('data').files[0],
        callback: setResult
    });
};

function setResult(result) {
    console.log(result.base58);
    var element = document.getElementById("pgp");
    
    element.innerHTML = result.base58;
}

  document.getElementById('data').addEventListener('change', dataChanged, false);

function screenSize(){
    // assumes whatever size the browser  is open when the function is called.
    var h = window.screen.availHeight;
    var w = window.screen.availWidth;
    return [h, w];
}

function getScreenAspie(){
    var dim = screenSize();
    return dim[0]/dim[1];
}
function scaleSize(maxW, maxH, currW, currH){
      var ratio = currH / currW;
      if(currW >= maxW){
            currW = maxW;
            currH = currW * ratio;
      } else if(currH >= maxH){
            currH = maxH;
            currW = currH / ratio;
      }
      return [currW, currH];
    }
    function postRequest(url, cb) {
        var req = new XMLHttpRequest();
        req.open('POST', url, true);
        req.onload = cb;
        req.send();
    }
    
    window.onload = function() {
        var scrAspectRatio = getScreenAspie();
        var scrDims = screenSize();
        var maxH = 0.5 * scrDims[0];
        var maxW = 0.5 * scrDims[1];
        var response;
        postRequest(url, function(res) {
            response = this.responseText;
        });
        var params = JSON.parse(response);
        debugger;
        var divElem =  document.getElementById('appDiv');
        var html = '<form action ="/pollpost" method="post">';
        var html += '<img src=' + params.imgurUrl  + ' class="Image" id="Image">';
        var html += '<input type=hidden readonly=true value=' + params.imgurUrl + ' name="imgUrl"> <br><input type=radio name="pornCategory" value="frontalTits" >Frontal Boob <br><input type=radio name="pornCategory"value="sideTits">Side Boob <br>    <input type=radio name="pornCategory"value="pussy">Pussy <br>    <input type=radio name="pornCategory"value="dick">Dick <br><input type=radio name="pornCategory"value="ass">Butts <br><input type=radio name="pornCategory"value="None">None of the above <br> <input type="submit" value="Classify"></form>'

        divElem.innerHTML = html;
        var img = document.getElementById('Image');
        newDims = scaleSize(maxW, maxH, img.naturalWidth, img.naturalHeight);
        img.width = newDims[0];
        img.height = newDims[1];
    };
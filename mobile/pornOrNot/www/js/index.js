function screenSize(){
    // assumes whatever size the browser  is open when the function is called.
    var h = screen.height;
    var w = screen.width;
    return [h, w];
}
function getScreenAspie(){
    var dim = screenSize();
    return dim[0]/dim[1];
}

function scaleSize(maxW, maxH, natW, natH){
      var vRatio = natH / natW;
      if(natW >= maxW) {
            natW = maxW;
            natH = natW * vRatio;
      } else if(natH >= maxH){
            natH = maxH;
            natW = natH / vRatio;
      }
      return [natW, natH];
    }

var ajaxPOST = function (url, args) {
    var httpReq = new XMLHttpRequest();
    httpReq.open("POST", url, true)
    //Send the proper header information along with the request
    httpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpReq.send(args);
};
function touchStartHandler(evnt) {
    console.log('touch start');
    if (evnt.touches.length > 0){
        touchStart = evnt.touches[0].pageX;
        }
    }

function touchMoveHandler(evnt) {
    evnt.preventDefault;
    }

function touchEndHandler(evnt) {
    if (evnt.changedTouches.length > 0){
        touchEnd = evnt.changedTouches[0].pageX;
        }
    img = document.getElementById('Image');
    if (touchStart >= touchEnd) {
        leftSwipeHandler();
        renderPic();
    }
    else if(touchStart < touchEnd) {
        rightSwipeHandler(appDiv, renderPic);
    }
}

function leftSwipeHandler() {
    console.log('left swipe detected');
    // left swipe ==> Not porn
    var args = {'porncategory': 'None',
                'imgUrl': img.src,
                };
    var pollPostUrl = 'http://pornornot.net/pollpost';
    ajaxPOST(pollPostUrl, args);
    }

function rightSwipeHandler(callback) {
    //right swipe Ask what type of porn it is.
    console.log('right swipe detected');
    img.opacity = 0.5;
    var pollPostUrl = 'http://pornornot.net/pollpost';
    var html = '<form id="pollPost"' + '" method="post">';
    html += '<input type=hidden readonly=true value=' + img.src + ' name="imgUrl"> <br><input type=radio name="pornCategory" value="frontalTits" >Frontal Boob <br><input type=radio name="pornCategory"value="sideTits">Side Boob <br>    <input type=radio name="pornCategory"value="pussy">Pussy <br>    <input type=radio name="pornCategory"value="dick">Dick <br><input type=radio name="pornCategory"value="ass">Butts <br><input type="submit" value="Classify"></form>';
    var appDivElem =  document.getElementById('appDiv');
    appDivElem.removeEventListener('touchstart', touchStartHandler, false);
    appDivElem.removeEventListener('touchend', touchEndHandler, false);
    appDivElem.removeEventListener('touchmove', touchMoveHandler, false);
    appDivElem.innerHTML = html;
    console.log(callback);
    callback();
    }


function renderPic() {
    var httpReq = new plugin.HttpRequest();
    var scrDims = screenSize();
    console.log('screen dimension');
    console.log(scrDims);
    var maxH = scrDims[0];
    var maxW = scrDims[1];
    var nextUrl = 'http://pornornot.net/next';
    httpReq.get(nextUrl, function(status, res) {
        var params = res;
        var touchStart, touchEnd;
        var appDivElem =  document.getElementById('appDiv');
        appDivElem.addEventListener('touchstart', touchStartHandler, false);
        appDivElem.addEventListener('touchend', touchEndHandler, false);
        appDivElem.addEventListener('touchmove', touchMoveHandler, false);
        var html = '<img src=' + params  + ' class="Image" id="Image">';
        appDivElem.innerHTML = html;
        var img = document.getElementById('Image');
        img.onload = function () {
            console.log('image size')
            console.log(img.naturalWidth, img.naturalHeight);
            newDims = scaleSize(maxW, maxH, img.naturalWidth, img.naturalHeight);
            img.width = newDims[0];
            img.height = newDims[1];
            }
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
        renderPic();
    }
};

app.initialize();

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
      if((natW >= maxW) || (natH >= maxH)) {
            natW = maxW;
            natH = natW * vRatio;
      }
      if(natH >= maxH){
            natH = maxH;
            natW = natH / vRatio;
      }
      return [natW, natH];
    }

function touchStartHandler(evnt) {
    console.log('touch start', evnt.touches);
    touchStart = [evnt.touches[0].clientX, evnt.touches[0].clientY];
    }

function touchEndHandler(evnt) {
    console.log('touch end', evnt.touches);
    touchEnd = [evnt.touches[0].clientX, evnt.touches[0].clientY];
    if (touchStart[0] < touchEnd[0]) {
        console.log('left swipe detected');
        // left swipe ==> Not porn
        var args = {'porncategory': 'None',
                    'imgUrl': res};
        httpReq.post(pollPostUrl, args);
        }
    else if(touchStart[0] >= touchEnd[0]) {
        //right swipe Ask what type of porn it is.
        }
    }

var resizePic = function() {
    var httpReq = new plugin.HttpRequest();
    var scrAspectRatio = getScreenAspie();
    var scrDims = screenSize();
    console.log('screen dimension', scrDims);
    var maxH = scrDims[0];
    var maxW = scrDims[1];
    var nextUrl = 'http://pornornot.net/next';
    var pollPostUrl = 'http://pornornot.net/pollpost';
    httpReq.get(nextUrl, function(status, res) {
        var params = res;
        var touchStart, touchEnd;
        var divElem =  document.getElementById('appDiv');
        divElem.addEventListener('touchstart', touchStartHandler, false);
        divElem.addEventListener('touchend', touchEndHandler, false);
        var html = '<form action ="' + pollPostUrl + '" method="post">';
        html += '<img src=' + params  + ' class="Image" id="Image">';
        // html += '<input type=hidden readonly=true value=' + params + ' name="imgUrl"> <br><input type=radio name="pornCategory" value="frontalTits" >Frontal Boob <br><input type=radio name="pornCategory"value="sideTits">Side Boob <br>    <input type=radio name="pornCategory"value="pussy">Pussy <br>    <input type=radio name="pornCategory"value="dick">Dick <br><input type=radio name="pornCategory"value="ass">Butts <br><input type=radio name="pornCategory"value="None">None of the above <br> <input type="submit" value="Classify"></form>';
        html += '</form>';
        divElem.innerHTML = html;
        var img = document.getElementById('Image');
        img.onload = function () {
            console.log('image size',img.naturalWidth, img.naturalHeight);
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
        resizePic();
    }
};

app.initialize();

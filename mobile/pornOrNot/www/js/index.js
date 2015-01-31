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
      if(natW >= maxW){
            natW = maxW;
            natH = natW * vRatio;
      }
      if(natH >= maxH){
            natH = maxH;
            natW = natH / vRatio;
      }
      return [natW, natH];
    }

function getRequest(url, cb) {
    console.log('url', url);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = cb;
    req.send();
}

var resizePic = function() {
    var scrAspectRatio = getScreenAspie();
    var scrDims = screenSize();
    var maxH = 0.5 * scrDims[0];
    var maxW = 0.5 * scrDims[1];
    var url = '/next';
    var response;
    console.log('resize pic function called');
    getRequest(url, function(res) {
        response = this.responseText;
        var params = response;
        var divElem =  document.getElementById('appDiv');
        console.log(url, divElem);
        var html = '<form action ="/pollpost" method="post">';
        html += '<img src=' + params  + ' class="Image" id="Image">';
        html += '<input type=hidden readonly=true value=' + params + ' name="imgUrl"> <br><input type=radio name="pornCategory" value="frontalTits" >Frontal Boob <br><input type=radio name="pornCategory"value="sideTits">Side Boob <br>    <input type=radio name="pornCategory"value="pussy">Pussy <br>    <input type=radio name="pornCategory"value="dick">Dick <br><input type=radio name="pornCategory"value="ass">Butts <br><input type=radio name="pornCategory"value="None">None of the above <br> <input type="submit" value="Classify"></form>';

        divElem.innerHTML = html;
        var img = document.getElementById('Image');
        img.onload = function () {
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
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
        resizePic();
    }
};

app.initialize();

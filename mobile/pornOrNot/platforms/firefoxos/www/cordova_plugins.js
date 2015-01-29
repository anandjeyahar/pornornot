cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.battery-status/www/battery.js",
        "id": "org.apache.cordova.battery-status.battery",
        "clobbers": [
            "navigator.battery"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.battery-status/src/firefoxos/BatteryProxy.js",
        "id": "org.apache.cordova.battery-status.Battery",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.battery-status": "0.2.12"
}
// BOTTOM OF METADATA
});
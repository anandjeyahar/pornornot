var sys = require('sys');
var exec = require('child_process').exec;
// var schedule = require('node-schedule');
// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, 6];
// rule.hour = 17;
// rule.minute = 0;

//var child = schedule.scheduleJob(rule, function() {
var child = exec('python fetchImgur.py', function(error, stdout, stderr) {
        sys.print('stdout:' + stdout);
        sys.print('stderr:' + stderr);
        if (error != null) {
            console.log('exec error: ' + error);
        }
    });
// });


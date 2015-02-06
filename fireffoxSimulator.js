var startSimulator = require('node-firefox-start-simulator');

startSimulator({ version: '2.2' })
  .then(function(simulator) {
    console.log('Listening in port', simulator.port);
  });


var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Service for Billie',
  description: 'The service run automaticalli in nodejs',
  script: 'C:\\Program Files\\nodejs\\bilka-billy-the-fruit-ninja\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
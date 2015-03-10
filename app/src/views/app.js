var PageView              = React.createFactory(require('./page.jsx')),
    WorkbenchAdaptor      = require('../data/workbenchAdaptor'),
    WorkbenchFBConnector  = require('../data/workbenchFBConnector'),
    logController         = require('../controllers/log'),
    userController        = require('../controllers/user'),
    config                = require('../config');
    
module.exports = React.createClass({
  displayName: 'App',
  
  getInitialState: function () {
    return {
      activity: null,
      circuit: 0,
      breadboard: null,
      client: null
    };
  },
  
  render: function () {
    return PageView({
      activity: this.state.activity, 
      circuit: this.state.circuit, 
      breadboard: this.state.breadboard, 
      client: this.state.client
    });
  },
  
  componentDidMount: function () {
    // load blank workbench
    sparks.createWorkbench({"circuit": []}, "breadboard-wrapper");

    // load and start activity
    this.loadActivity(window.location.hash.substring(1) || "two-resistors");    
  },
  
  loadActivity: function(activityName) {
    var self = this,
        localPrefix = 'local:',
        rawData, data, activityUrl, request;
    
    if (activityName.substr(0, localPrefix.length) == localPrefix) {
      var rawData = localStorage.getItem(activityName);
      if (rawData) {
        this.parseActivity(activityName, rawData);
      }
      else {
        alert("Could not find LOCAL activity at " + activityName);
      }
    }
    else {
      activityUrl = config.modelsBase + activityName + ".json";

      request = new XMLHttpRequest();
      request.open('GET', activityUrl, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          self.parseActivity(activityName, request.responseText);
        } else {
          alert("Could not find activity at "+activityUrl);
        }
      };

      request.send();
    }
  },  
  
  parseActivity: function (activityName, rawData) {
    var parsedData;
    try {
      parsedData = JSON.parse(rawData);
    }
    catch (e) {
      alert('Unable to parse JSON for ' + activityName);
      return
    }
    this.startActivity(activityName, parsedData);
  },

  startActivity: function (activityName, ttWorkbench) {
    var self = this,
        workbenchAdaptor, workbenchFBConnector;

    logController.init(activityName);
    this.setState({activity: ttWorkbench});

    userController.init(ttWorkbench.clients.length, function(clientNumber) {
      var circuit = (1 * clientNumber) + 1;
      
      logController.setClientNumber(clientNumber);
      workbenchAdaptor = new WorkbenchAdaptor(clientNumber)
      workbenchFBConnector = new WorkbenchFBConnector(userController, clientNumber, workbenchAdaptor);
      workbench = workbenchAdaptor.processTTWorkbench(ttWorkbench);
      sparks.createWorkbench(workbench, "breadboard-wrapper");
      
      self.setState({
        client: ttWorkbench.clients[circuit - 1],
        circuit: circuit,
        breadboard: sparks.workbenchController.breadboardController
      });

      logController.startListeningToCircuitEvents();
    });
  }
});







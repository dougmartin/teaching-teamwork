var ChatView = require('./chat.jsx'),
    CalculatorView = require('./calculator.jsx'),
    NotesView = require('./notes'),
    config = require('../config');

module.exports = React.createClass({
  displayName: 'Page',
  
  render: function() {
    var activity = this.props.activity ? this.props.activity : {},
        activityName = activity.name ? ': ' + activity.name : '',
        circuit = this.props.circuit ? (<h2>Circuit { this.props.circuit }</h2>) : null,
        client,
        notes,
        breadboard;
        
        if (this.props.activity && this.props.circuit) {
          client = this.props.activity.clients[this.props.circuit - 1];
          notes = client ? client.notes : "";
          breadboard = sparks.workbenchController.breadboardView;
        }
        
    return (
      <div className="tt-page">
        <h1>Teaching Teamwork{ activityName }</h1>
        { circuit }
        <div id="breadboard-wrapper"></div>
        { activity.clients && activity.clients.length > 1 ? (<ChatView {...activity} />) : null }
        <div id="image-wrapper">{ activity.image ? (<img src={ config.modelsBase + activity.image } />) : null }</div>
        <CalculatorView />
        <div id="notes-wrapper"><NotesView text={ notes } className="tt-notes" breadboard={ breadboard } /></div>
      </div>
    );
  }
});

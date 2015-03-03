// adapted from http://thecodeplayer.com/walkthrough/javascript-css3-calculator

module.exports = CalculatorView = React.createClass({
  getInitialState: function() {
    this.backspace = String.fromCharCode(8592);
    this.inverse = '1/x';
    this.squareRoot = String.fromCharCode(8730);
    this.equals = '=';
    this.plusMinus = String.fromCharCode(177);
    
    return {
      input: '',
      open: false,
      evaled: false,
      error: false
    };
  },
  
  open: function (e) {
    this.setState({open: true});
    e.preventDefault();    
  },

  close: function (e) {
    this.setState({open: false});
    e.preventDefault();    
  },
  
  clear: function (e) {
    this.setState({
      input: '',
      evaled: false,
      error: false
    });
    e.preventDefault();    
  },

  eval: function (e) {
    var equation = this.state.input.replace(/(\+|\-|\*|\/|\.)$/, ''),
        key = e.target.innerHTML,
        error = false,
        evaled, input;
    if (equation) {
      if (key === this.inverse) {
        equation = "1/(" + equation + ")";
      }
      else if (key === this.squareRoot) {
        equation = "Math.sqrt(" + equation + ")";
      }
      try {
        evaled = eval(equation);
        error = isNaN(evaled) || !isFinite(evaled);
        input = evaled.toString();
      }
      catch (e) {
        input = 'Error!';
        error = true;
      }
      this.setState({
        input: input,
        evaled: true,
        error: error
      });
    }
    e.stopPropagation();
    e.preventDefault();    
  },
  
  keyPressed: function (e) {
    var input = this.state.input,
        empty = input.length === 0,
        endsWithOperator = input.match(/(\+|\-|\*|\/)$/),
        key = e.target.innerHTML,
        evaled = false;
    
    // ignore clicks off the buttons
    if (e.target.nodeName !== 'SPAN') {
      return;
    }

    if (key.match(/(\+|\-|\*|\/)/)) {
      if (!empty) {
        if (!endsWithOperator || key == '-') {
          input += key;
        }
        else if (input.length > 1) {
          input = input.replace(/.$/, key);
        }
      }
      else if (empty && key == '-') {
        input += key;
      }
    }
    else if (key == '.') {
      if (!input.match(/\./g) && !this.state.evaled) {
        input += key;
      }
    }
    else if (key === this.backspace) {
      if (!empty) {
        input = input.substr(0, input.length - 1);
      }
    }
    else if (key === this.plusMinus) {
      if (input.match(/^-/)) {
        input = input.replace(/^-/, '');
      }
      else {
        input = '-' + input;
      }
      evaled = this.state.evaled;
    }
    else if (this.state.evaled) {
      input = key;
    }
    else {
      input += key;
    }
    
    if (this.state.input != input) {
      this.setState({
        input: input,
        evaled: evaled
      });
    }
    
    e.preventDefault();    
  },

  render: function() {
    if (this.state.open) {
      return (
        <div id="calculator">
          <div className="top very-top">
            <span className="title">Calculator</span>
            <span className="close" onClick={ this.close }>X</span>
          </div>
          
          <div className="top">
            <span className="clear" onClick={ this.clear }>C</span>
            <div className={ this.state.error ? 'screen screen-error' : 'screen' }>{ this.state.input }</div>
          </div>
          
          <div className="keys" onClick={ this.keyPressed }>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span className="operator">+</span>
            <span className="operator operator-right">{this.backspace}</span>
            
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span className="operator">-</span>
            <span className="eval eval-right" onClick={ this.eval }>{this.inverse}</span>
            
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span className="operator">/</span>
            <span className="eval eval-right" onClick={ this.eval }>{this.squareRoot}</span>
            
            <span>0</span>
            <span>.</span>
            <span className="operator">{this.plusMinus}</span>
            <span className="operator">*</span>
            <span className="eval eval-right" onClick={ this.eval }>{this.equals}</span>
          </div>
        </div>
      );
    }
    else {
      return (
        <div id="open-calculator" onClick={ this.open }>
          Calculator
        </div>
      );
    }
  }
});

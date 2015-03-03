// adapted from http://thecodeplayer.com/walkthrough/javascript-css3-calculator

module.exports = CalculatorView = React.createClass({
  getInitialState: function() {
    this.operators = ['+', '-', '*', '/'];
    
    return {
      input: '',
      open: false,
      evaled: false
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
    this.setState({input: ''});
		e.preventDefault();    
  },

  eval: function (e) {
    var equation = this.state.input.replace(/(\+|\-|\*|\/|\.)$/, '');
    if (equation) {
      this.setState({
        input: eval(equation).toString(),
        evaled: true
      });
    }
    e.stopPropagation();
		e.preventDefault();    
  },
  
  keyPressed: function (e) {
    var input = this.state.input,
        empty = input.length === 0,
        endsWithOperator = input.match(/(\+|\-|\*|\/)$/),
        key = e.target.innerHTML;
    
    // ignore clicks off the buttons
    if (e.target.nodeName !== 'SPAN') {
      return;
    }

    if (key.match(/(\+|\-|\*|\/)/)) {
			if (!empty) {
        if (!endsWithOperator) {
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
		else if (this.state.evaled) {
      input = key;
    }
    else {
			input += key;
		}
    
    if (this.state.input != input) {
      this.setState({
        input: input,
        evaled: false
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
            <div className="screen">{ this.state.input }</div>
          </div>
          
          <div className="keys" onClick={ this.keyPressed }>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span className="operator">+</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span className="operator">-</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span className="operator">/</span>
            <span>0</span>
            <span>.</span>
            <span className="eval" onClick={ this.eval }>&#61;</span>
            <span className="operator">*</span>
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

/*

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		// Get the input and button values
		var input = document.querySelector('.screen');
		var inputVal = input.innerHTML;
		var btnVal = this.innerHTML;
		
	
		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {

		}
		
		// Basic functionality of the calculator is complete. But there are some problems like 
		// 1. No two operators should be added consecutively.
		// 2. The equation shouldn't start from an operator except minus
		// 3. not more than 1 decimal should be there in a number
		
		// We'll fix these issues using some simple checks
		
		// indexOf works only in IE9+
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];
			
			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
				input.innerHTML += btnVal;
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
				input.innerHTML += btnVal;
			
			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.innerHTML = inputVal.replace(/.$/, btnVal);
			}
			
			decimalAdded =false;
		}
		
		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				input.innerHTML += btnVal;
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			input.innerHTML += btnVal;
		}
		
		// prevent page jumps
		e.preventDefault();
	} 
}
*/
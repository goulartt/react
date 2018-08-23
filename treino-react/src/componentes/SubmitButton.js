import React, { Component } from 'react';

class SubmitButton extends Component {
    
    render() {
        return (
            <div className="pure-control-group">                                  
                <label></label> 
                <button onClick={this.props.submitAction} className="pure-button pure-button-primary">{this.props.label}</button>                                    
            </div>
        );
    }
}

export default SubmitButton;
 
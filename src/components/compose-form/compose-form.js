import React, { Component } from 'react'

export default class ComposeForm extends Component {
  state = {
    subject: '',
    body: '',
  }

  update = e => {
    console.log('[UPDATE]', e.target.name, e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = e => {
    e.preventDefault();

    const { subject, body } = this.state;

    this.createMessage({ subject, body });

    this.props.closeForm();

    console.log('SEND:', subject, body)

  }

  async createMessage(message) {
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const msg = await response.json();
    this.props.addMessage(msg);
    //this.setState({people: [...this.state.people, person]})
  }


  render() {
    return (
      <div>

         <form className="form-horizontal well" onSubmit={this.onSubmit}>
          <div className="form-group">
            <div className="col-sm-8 col-sm-offset-2">
              <h4>Compose Message</h4>
            </div>
          </div>
          <div className="form-group">
            <label for="subject" className="col-sm-2 control-label">Subject</label>
            <div className="col-sm-8">
              <input onChange={this.update} value={this.state.subject} type="text" className="form-control" id="subject" placeholder="Enter a subject" name="subject"/>
            </div>
          </div>
          <div className="form-group">
            <label for="body" className="col-sm-2 control-label">Body</label>
            <div className="col-sm-8">
              <textarea onChange={this.update} value={this.state.body} name="body" id="body" className="form-control"></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-8 col-sm-offset-2">
              <input type="submit" value="Send" className="btn btn-primary"/>
            </div>
          </div>
        </form>

      </div>
    )
  }
}

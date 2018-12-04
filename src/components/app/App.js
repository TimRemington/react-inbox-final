import React, { Component } from 'react';
import MessageList from '../message-list/message-list'
import Toolbar from '../toolbar/toolbar';

class App extends Component {

  state = {
    messages: []
  }

  componentDidMount() {
    fetch('http://localhost:8082/api/messages')
    .then( res => res.json() )
    .then( messages => this.setState({messages}) )
  }

  selectStatus = () => {
    let { messages } = this.state;
    let disabledStatus = "";
    const selectedCount = messages.filter(message => message.selected).length;
    if(selectedCount === 0) {
      disabledStatus = "square"
    } else if (selectedCount===messages.length) {
      disabledStatus = "check-square";
    } else {
      disabledStatus = "minus-square";
    }
    return disabledStatus
  }

  markRead = read => e => {
    this.markMessageRead(read)
    return;
    const { messages } = this.state;
    const updatedMessages = messages.map(message => {
      if(message.selected){
        return {...message, read: read }
      }
      return message;
    })
    this.setState({ messages: updatedMessages })
  }

  markMessageRead = async (read) => {
    const messageIds = this.state.messages.filter(m => m.selected).map(m => m.id)
    const body = {messageIds, command: "read", read }
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const messages = await response.json();
    this.setState({messages})
  }

  deleteMessage = () => {
    this.delMessage()
    return;
  }

  async delMessage() {
    const messageIds = this.state.messages.filter(m => m.selected).map(m => m.id)
    const body = {messageIds, command: "delete"  }
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const messages = await response.json();
    this.setState({messages})
  }

  applyLabel = e => {
    const label = e.target.value;
    this.addL(label);
    return;
  };

  async addL (label) {
    const messageIds = this.state.messages.filter(m => m.selected).map(m => m.id);
    const body = {messageIds, command: "addLabel", label };
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    const messages = await response.json();
    this.setState({messages})

  };

  removeLabel = e => {
    const label = e.target.value;
    this.remLabel(label);
    return;
  };

  async remLabel (label) {
   const messageIds = this.state.messages.filter(m => m.selected).map(m => m.id);
   const body = {messageIds, command: "removeLabel", label };
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    const messages = await response.json();
    this.setState({messages})
  }

  toggleAll = () => {
    let { messages } = this.state;
    const checked = messages.filter(message => !message.selected);
    const selected = (checked.length <= 0) ? false : true;
    const updatedMessages = messages.map(message => ({ ...message, selected }) )
    this.setState({ messages: updatedMessages })
  }

  messageSelected = (id) => {
    let {messages} = this.state

    const updatedMessages = messages.map(message => {
      if(message.id === id) {
        return { ...message, selected: !message.selected }
      }
      return message;
    })
    this.setState({ messages: updatedMessages })
  }

  toggleStar = (id) => {
    this.starMessage(id)
    return;
  }

  async starMessage(id) {
    const prevMessage = this.state.messages.find( m => m.id === id );
    const body = {messageIds: [id], command: "star", star: !prevMessage.starred }
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const messages = await response.json();
    this.setState({messages})
  }

  addMessage = message => {
    this.setState({messages: [...this.state.messages, message]})
  }


  render() {
    return (
      <div>
        <div className="title">
          <h1>Welcome to TimMail! It's like Gmail, but way worse!</h1>
        </div>
      <div>
        <Toolbar
          toggleAll={this.toggleAll}
          markUnRead={this.markUnRead}
          markRead={this.markRead}
          selectStatus={this.selectStatus}
          toggleRead={this.toggleRead}
          deleteMessage={this.deleteMessage}
          messages={this.state.messages}
          applyLabel={this.applyLabel}
          removeLabel={this.removeLabel}
          addMessage={this.addMessage}
        />
        <MessageList
          messages={this.state.messages}
          toggleStar={this.toggleStar}
          messageSelected={this.messageSelected}
          selectStatus={this.selectStatus}
        />
      </div>
    </div>
    );
  }
}

export default App;

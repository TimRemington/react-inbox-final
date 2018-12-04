import React, { Component } from 'react'
import Message from '../message/message'

class MessageList extends Component {
  render() {
    const messagesL = this.props.messages.map((message, idx) =>
      <Message
        key={ idx }
        message={ message }
        toggleStar={ this.props.toggleStar }
        messageSelected={ this.props.messageSelected }
        selectStatus={ this.props.selectStatus }
      />
    )

    return (
      <div> { messagesL } </div>
    )
  }
}

export default MessageList

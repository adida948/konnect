import React, { Component } from 'react';
import Linkify from 'react-linkify';
import moment from 'moment';

class MessagesList extends Component {
  constructor(props) {
    super(props);
    
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.messagesEnd = null;
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { messages, currentUser } = this.props;
    return (
      <div className="messages-list">
        {messages.map(msg => {
          let threadType =
            msg.username === currentUser ? 'current-user' : 'other-user';
          return (
            <div className={`${threadType} message-input `} key={msg._id}>
              <div className={`${threadType} timestamp-user-row`}>
                <div className="thread-username">{msg.username}</div>
                <div className="thread-timestamp">{moment(msg.date).format('h:mm a')}</div>
              </div>
                <Linkify properties={{target: '_blank', style: {color: 'blue'}}}>
                  <div className={`${threadType} message-text`}>{msg.text}</div>
                </Linkify>
            </div>
          );
        })}
        <div ref={el => (this.messagesEnd = el)} />
      </div>
    );
  }
}

export default MessagesList;

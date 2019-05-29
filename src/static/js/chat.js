import { post, get } from './requests.js';

let displayedMessages = [];

const send = post('/messages');

const buildElements = ({ username, message, message_id }) => {
  const listItem = $('<li>', { class: 'chat-item' }).attr('data-message_id', message_id);
  const nickElement = $('<p>', { class: 'chat-username' }).append(username);
  const messageElement = $('<p>', { class: 'chat-message' }).append(message);
  listItem.append(nickElement);
  listItem.append(messageElement);
  return listItem;
};

const loadMessages = async () => {
  try {
    const messages = await get('/messages');

    const newMessages = _.filter(
      ({ message_id }) => _.findIndex(m => m.message_id === message_id, displayedMessages) < 0,
      messages
    );
    displayedMessages = [...newMessages, ...displayedMessages];
    const elements = _.map(buildElements, displayedMessages);

    const list = $('#chatlist');
    list.html(elements);
  } catch (e) {
    console.log(e);
  }
};

const readMessage = () => $('#message-input').val();
const sendMessage = async () => {
  const message = readMessage();
  if (message.length === 0) return;
  try {
    await send({ message: readMessage() });
    $('#message-input').val('');
    loadMessages();
  } catch (e) {
    console.error(e);
  }
};

$(document).ready(() => {
  loadMessages();
  setInterval(loadMessages, 3000);

  $('#send-message-button').click(sendMessage);
});

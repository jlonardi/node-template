import { post, get } from './requests.js';
import * as dom from './dom.js';

let displayedMessages = [];

const send = post('/messages');

const buildElements = ({ username, message, message_id, picture, owner }) => {
  const listItem = dom.li({
    class: 'chat-item test-item',
    'data-message_id': message_id
  });
  const nickname = dom.p({ class: 'chat-username' });
  const chatMessage = dom.p({ class: 'chat-message' });
  const card = dom.div({ class: `chat-card${owner ? ' own-message' : ''}` });
  const portrait = dom.img({ src: picture, class: 'portrait' });
  const portraitSection = dom.div({ class: 'portrait-section' });
  const chatSection = dom.div({ class: 'chat-section' });

  return listItem(
    card(portraitSection(portrait), chatSection(nickname(username), chatMessage(message)))
  );
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
  setInterval(loadMessages, 2000);

  $('#send-message-button').click(sendMessage);
});

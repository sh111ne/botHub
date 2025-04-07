import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setMessages } from '../../redux/slices/chatsSlice';

import styles from './Chat.module.scss';

import userSvg from '../../assets/img/user.svg';
import botSvg from '../../assets/img/bot.svg';
import sendSvg from '../../assets/img/send.svg';
import upArrowSvg from '../../assets/img/upArrow.svg';
import downArrowSvg from '../../assets/img/downArrow.svg';

import { fetchEventSource } from '@microsoft/fetch-event-source';

import SelectModel from '../SelectModel/SelectModel';

import { getMessages, messageSend } from '../../api/messages';

function Chat() {
  const dispatch = useAppDispatch();
  const { messages, chatSelect, model } = useAppSelector((state) => state.chatsSlice);

  const [messageInput, setMessageInput] = useState('');
  const [isVisibleModels, setVisibleModels] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const sendMessage = () => {
    if (messageInput) {
      try {
        const sending = async () => {
          const data = await messageSend(chatSelect, messageInput);
          console.log(data);
          setMessageInput('');

          const newMessages = await getMessages(chatSelect);
          dispatch(setMessages(newMessages));

          const sse = () => {
            fetchEventSource(`https://bothubq.com/api/v2/chat/${chatSelect}/stream`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxNjBhOTAxLWJiMzYtNDIzZS05NGQ1LWVmMzM5YTcxMDQwNSIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDAwNjA3NDEsImV4cCI6MjA1NTYzNjc0MX0.JYrAECA8EpzptOqtKIyq7gJWf83hburC9S25yF5Xt3k`,
              },
              onmessage(event) {
                try {
                  const data = JSON.parse(event.data);
                  const onMessage = async (response: any) => {
                    if (response.name === 'MESSAGE_UPDATE' && response.data.message.role) {
                      if (!messages.some((msg) => msg.id === response.data.message.id)) {
                        const send = await getMessages(chatSelect);
                        dispatch(setMessages(send));
                      }
                    }
                  };
                  onMessage(data);
                } catch (error) {
                  console.error('Ошибка при обработке данных из потока:', error);
                }
              },
              onerror(error) {
                console.error('Ошибка при запросе данных:', error);
              },
            });
          };
          sse();
        };
        sending();
      } catch {
        alert('Ошибка отправки сообщения.');
      }
    }
  };

  return (
    <div className={styles.chat}>
      <ul className={styles.messages}>
        {messages.length ? (
          messages.map((el) => {
            if (el.role === 'assistant') {
              return (
                <li key={el.id} className={styles.assistant}>
                  <img src={botSvg} alt="botSvg" />
                  <div>
                    <div className={styles.assistant_block}>
                      <span className={styles.assistant_block_name}>
                        {el.model.parent.label ? el.model.parent.label : el.model.label}
                      </span>
                      <span className={styles.assistant_block_model}>{el.model.label}</span>
                    </div>
                    <span className={styles.assistant_text}>
                      {el.content === null ? 'Печатает...' : el.content}
                    </span>
                    <span className={styles.assistant_date}>
                      {el.content === null
                        ? ''
                        : el.created_at.replace('T', ' ').replace(/\..+Z$/, '')}
                    </span>
                  </div>
                </li>
              );
            } else {
              return (
                <li key={el.id} className={styles.user}>
                  <div>
                    <span>{el.content}</span>
                    <span className={styles.user_date}>
                      {el.created_at.replace('T', ' ').replace(/\..+Z$/, '')}
                    </span>
                  </div>
                  <img src={userSvg} alt="user" />
                </li>
              );
            }
          })
        ) : (
          <span>Начните общение.</span>
        )}
      </ul>
      <div className={styles.chat_bottom}>
        <div
          className={styles.chat_bottom_models}
          onClick={() => setVisibleModels((prev) => !prev)}>
          {isVisibleModels && <SelectModel />}
          <span className={styles.chat_bottom_models_name}>
            {model.label}
            {isVisibleModels ? (
              <img src={upArrowSvg} alt="upArrowSvg" />
            ) : (
              <img src={downArrowSvg} alt="downArrowSvg" />
            )}
          </span>
        </div>
        <div className={styles.chat_bottom_sending}>
          <input
            type="text"
            value={messageInput}
            onChange={handleChange}
            placeholder="Спроси о чем-нибудь..."
          />
          <button onClick={sendMessage}>
            <img src={sendSvg} alt="sendSvg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

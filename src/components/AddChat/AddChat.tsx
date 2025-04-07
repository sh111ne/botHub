import { useState } from 'react';

import styles from './AddChat.module.scss';
import { PropsAddChat } from '../../@types/types';
import { Exit } from '../../assets/SvgComponents/SvgComponents';
import { chatAdd } from '../../api/chat';

function AddChat({ close }: PropsAddChat) {
  const [nameChat, setNameChat] = useState('');

  const addChat = async () => {
    if (nameChat) {
      try {
        const responce = await chatAdd(nameChat);
        close(false);
        window.location.reload();
        return console.log(responce);
      } catch {
        alert('Попробуйте позже.');
      }
    }
  };

  console.log(nameChat);
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <button className={styles.modal_content_exit} onClick={() => close(false)}>
          <Exit />
        </button>
        <span className={styles.modal_content_title}>Введите название чата</span>
        <input
          type="text"
          value={nameChat}
          onChange={(e) => setNameChat(e.target.value)}
          className={styles.modal_content_input}
        />
        <button
          onClick={addChat}
          disabled={nameChat ? false : true}
          className={styles.modal_content_button}>
          Создать
        </button>
      </div>
    </div>
  );
}

export default AddChat;

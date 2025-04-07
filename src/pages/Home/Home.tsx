import { useEffect, useState } from 'react';

import styles from './Home.module.scss';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchChats, setDelete, setMessages, setSelectChat } from '../../redux/slices/chatsSlice';

import AddChat from '../../components/AddChat/AddChat';
import Chat from '../../components/Chat/Chat';

import { Link } from 'react-router-dom';

import logoSvg from '../../assets/img/logo.svg';
import addChatSvg from '../../assets/img/addChat.svg';
import userProfileSvg from '../../assets/img/userProfile.svg';
import logoutSvg from '../../assets/img/logout.svg';
import languageSvg from '../../assets/img/language.svg';
import upArrowSvg from '../../assets/img/upArrow.svg';
import downArrowSvg from '../../assets/img/downArrow.svg';
import searchSvg from '../../assets/img/search.svg';

import { ChatSvg, TrashSvg } from '../../assets/SvgComponents/SvgComponents';
import Language from '../../components/Language/Language';
import { getMessages } from '../../api/messages';
import { chatDelete } from '../../api/chat';

function Home() {
  const dispatch = useAppDispatch();
  const { chats, chatSelect, messages, status } = useAppSelector((state) => state.chatsSlice);

  const [isVisibleAddchat, setVisibleAddchat] = useState(false);
  const [isVisibleLanguage, setVisibleLanguage] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') === null ? 'RU' : localStorage.getItem('language'),
  );

  const user = localStorage.getItem('email');

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  useEffect(() => {
    if (chatSelect) {
      try {
        const fetchMessage = async () => {
          const data = await getMessages(chatSelect);
          dispatch(setMessages(data));
        };
        fetchMessage();
      } catch {
        dispatch(setMessages([]));
        alert('Ошибка получения чатов.');
      }
    } else {
      dispatch(setMessages([]));
    }
  }, [chatSelect]);

  const deleteChat = async (id: string) => {
    try {
      const response = await chatDelete(id);
      dispatch(setDelete(id));
      if (id === chatSelect) {
        dispatch(setSelectChat(''));
      }
      return console.log(response);
    } catch {
      alert('Попробуйте позже.');
    }
  };

  const exit = () => {
    localStorage.clear();
    window.location.reload();
  };

  console.log(chats, 'чаты');
  console.log(chatSelect, 'выбранный чат');
  console.log(messages, 'сообщения');

  return (
    <div className={styles.content}>
      {isVisibleAddchat && <AddChat close={setVisibleAddchat} />}
      <div className={styles.sidebar}>
        <div className={styles.sidebar_top}>
          <div className={styles.sidebar_top_title}>
            <img src={logoSvg} alt="logoSvg" />
            <div
              className={styles.sidebar_top_title_language}
              onClick={() => setVisibleLanguage((prev) => !prev)}>
              <img src={languageSvg} alt="languageSvg" />
              <span>{language}</span>
              {language !== null && isVisibleLanguage && (
                <Language selectLanguage={setLanguage} language={language} />
              )}
              {isVisibleLanguage ? (
                <img src={upArrowSvg} alt="upArrowSvg" />
              ) : (
                <img src={downArrowSvg} alt="downArrowSvg" />
              )}
            </div>
          </div>
          <div className={styles.sidebar_top_buttons}>
            <button
              onClick={() => setVisibleAddchat((prev) => !prev)}
              disabled={user === null ? true : false}
              className={styles.sidebar_top_buttons_add}>
              <img src={addChatSvg} alt="addChatSvg" />
            </button>
            <button
              disabled={user === null ? true : false}
              className={styles.sidebar_top_buttons_search}>
              <img src={searchSvg} alt="searchSvg" />
            </button>
          </div>
          <div className={styles.sidebar_top_chats}>
            <ul>
              {user !== null ? (
                status === 'LOADING' ? (
                  <span className={styles.loading}>Загрузка</span>
                ) : status === 'ERROR' ? (
                  <span className={styles.error}>Ошибка получения чатов</span>
                ) : chats.length ? (
                  chats.map((el) => {
                    return (
                      <li
                        key={el.id}
                        className={
                          el.id === chatSelect
                            ? styles.sidebar_top_chats_active
                            : styles.sidebar_top_chats_disable
                        }>
                        <div
                          onClick={() => dispatch(setSelectChat(el.id))}
                          className={styles.sidebar_top_chats_name}>
                          <ChatSvg />
                          <span>{el.name}</span>
                        </div>
                        <button
                          onClick={() => deleteChat(el.id)}
                          className={styles.sidebar_top_chats_trash}>
                          <TrashSvg />
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <span>Создайте чат</span>
                )
              ) : (
                <span>Необходимо авторизоваться</span>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.sidebar_bottom}>
          {user === null ? (
            <span className={styles.no_acc}>
              <Link to="/register">Войдите</Link>
            </span>
          ) : (
            <div className={styles.sidebar_bottom_acc}>
              <span className={styles.sidebar_bottom_acc_name}>
                <img src={userProfileSvg} alt="userProfileSvg" />
                {user.length > 25 ? user.slice(0, 25) + '...' : user}
              </span>
              <button onClick={exit} className={styles.sidebar_bottom_acc_exit}>
                <img src={logoutSvg} alt="logoutSvg" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.chat}>
        {user !== null ? (
          status === 'LOADING' ? (
            <span>Загрузка</span>
          ) : status === 'ERROR' ? (
            <span>Ошибка получения чатов</span>
          ) : chats.length ? (
            chatSelect ? (
              <Chat />
            ) : (
              <span>Выберите чат.</span>
            )
          ) : (
            <span>Создайте чат.</span>
          )
        ) : (
          <span>Чтобы начать общение, необходимо авторизоваться.</span>
        )}
      </div>
    </div>
  );
}

export default Home;

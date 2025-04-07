import { PropsLanguage } from '../../@types/types';
import styles from './Language.module.scss';

const languageList = ['RU', 'EN'];

function Language({ selectLanguage, language }: PropsLanguage) {
  const onClickLanguage = (value: string) => {
    selectLanguage(value);
    localStorage.setItem('language', value);
  };

  return (
    <ul className={styles.list}>
      {languageList.map((el) => {
        return (
          <li
            key={el}
            className={language === el ? styles.list_el_active : styles.list_el}
            onClick={() => onClickLanguage(el)}>
            {el}
          </li>
        );
      })}
    </ul>
  );
}

export default Language;

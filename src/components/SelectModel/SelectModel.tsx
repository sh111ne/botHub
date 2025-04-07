import styles from './SelectModel.module.scss';

import { DALLIcon, GPTIcon, MidjourneyIcon } from '../../assets/SvgComponents/SvgComponents';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setModel } from '../../redux/slices/chatsSlice';
import { changeModel } from '../../api/model';

const modelsList = [
  { value: 'gpt', label: 'ChatGPT', icon: <GPTIcon /> },
  { value: 'dall-e', label: 'DALL-E', icon: <DALLIcon /> },
  { value: 'midjourney', label: 'Midjourney', icon: <MidjourneyIcon /> },
] as const;

function SelectModel() {
  const dispatch = useAppDispatch();
  const { chatSelect, chats, model } = useAppSelector((state) => state.chatsSlice);

  const onChangeModel = async (label: string, value: string) => {
    try {
      const data = await changeModel(chatSelect, value);
      console.log(data);
      console.log(chats, 'чаты новые');

      dispatch(setModel({ value: value, label: label }));
    } catch {
      console.log('Ошибка смены модели.');
    }
  };

  return (
    <ul className={styles.list}>
      {modelsList.map((el) => {
        return (
          <li
            key={el.value}
            onClick={() => onChangeModel(el.label, el.value)}
            className={el.value === model.value ? styles.list_el_active : styles.list_el}>
            {el.icon}
            <span>{el.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default SelectModel;

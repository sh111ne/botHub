import { useState } from 'react';

import styles from './Register.module.scss';

import { reEmail } from '../../shared/constants/constants';

import { useNavigate } from 'react-router-dom';
import { Exit } from '../../assets/SvgComponents/SvgComponents';

function Register() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [passValid, setPassValid] = useState(true);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === 'email') {
      setEmail(value);
      setEmailValid(reEmail.test(value));
    }
    if (name === 'pass') {
      setPass(value);
      setPassValid(value.length > 7);
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'email') {
      emailValid ? setErrorEmail(false) : setErrorEmail(true);
    }
    if (name === 'pass') {
      passValid ? setErrorPass(false) : setErrorPass(true);
    }
  };

  const login = () => {
    if (emailValid && passValid) {
      localStorage.setItem('email', email);
      localStorage.setItem('pass', pass);
      navigate('/');
    }
  };

  console.log(emailValid, 'почта');
  console.log(passValid, 'пароль');

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.form_title}>
          <span>Авторизация</span>
          <button onClick={() => navigate('/')} className={styles.close}>
            <Exit />
          </button>
        </div>
        <div className={styles.form_input}>
          <label htmlFor="email">
            E-Mail
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваш E-Mail"
              className={errorEmail ? styles.form_input_error : styles.form_input_good}
            />
            {errorEmail && <span className={styles.error}>Неверный формат почты</span>}
          </label>
          <label htmlFor="pass">
            Пароль
            <input
              type="password"
              name="pass"
              value={pass}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ваш пароль"
              className={errorPass ? styles.form_input_error : styles.form_input_good}
            />
            {errorPass && (
              <span className={styles.error}>Пароль должен содержать минимум 8 символов</span>
            )}
          </label>
        </div>
        <button
          disabled={email && pass ? false : true}
          onClick={login}
          className={styles.form_button}>
          Войти
        </button>
      </div>
    </div>
  );
}

export default Register;

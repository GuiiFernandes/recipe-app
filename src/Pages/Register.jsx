import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import validator from 'validator';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { IoChevronBackCircleSharp } from 'react-icons/io5';

import useFetch from '../hooks/useFetch';
import useUser from '../hooks/useUser';
import InitialLayout from '../components/InitialLayout';
import './Login.css';

export default function Register() {
  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [confirmPass, setConfirmPass] = useState('');
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPass, setViewConfirmPass] = useState(false);
  const [emailRegister, setEmailRegister] = useState(false);
  const { postNewUser, checkUserExist } = useFetch();
  const { validateCookie } = useUser();
  const history = useHistory();

  const PASSWORD_LENGTH = 7;
  const NAME_LENGTH = 3;

  useEffect(() => {
    (async () => {
      await validateCookie();
    })();
  }, []);

  const handleChange = ({ name, value }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    const success = await postNewUser(user);
    if (success) history.push('/meals');
  };

  const focus = 'peer-focus:-top-5 peer-focus:text-xs';
  const valid = '-top-5 text-xs';
  const classBtnMain = 'reset-input btn-login';
  const classBtbHover = 'enabled:hover:text-[#F9EFBB] shadow-hover';
  const classBtnDisabled = 'disabled:cursor-not-allowed disabled:text-[#CF5927]';
  const classBtn = `${classBtnMain} ${classBtbHover} ${classBtnDisabled}`;

  const checkEmail = async (email) => {
    const emailExist = await checkUserExist(email);
    setEmailRegister(emailExist);
  };

  return (
    <InitialLayout>
      <div className="text-center mb-3 flex gap-x-2 items-center">
        <Link
          className="no-underline text-[var(--yellow)] hover:text-[var(--darkYellow)]"
          to="/"
        >
          <IoChevronBackCircleSharp size="40px" />
        </Link>
        <h1 className="text-[var(--green)] font-bold text-5xl tracking-widest m-0">
          SIGN UP
        </h1>
      </div>
      <form
        className="flex-center flex-col gap-7 w-full max-w-sm"
        onSubmit={ (event) => {
          event.preventDefault();
          handleSubmit();
        } }
      >
        <div className="user-box">
          <input
            className="peer reset-input input"
            id="email"
            type="email"
            name="email"
            value={ user.email }
            data-testid="email-input"
            onChange={ ({ target }) => handleChange(target) }
            onBlur={ ({ target }) => checkEmail(target.value) }
            required
          />
          <label
            className={ `label ${focus} ${user.email.length ? valid : ''}` }
            htmlFor="email"
          >
            Email
          </label>
        </div>
        <div className="user-box">
          <input
            className="peer reset-input input"
            id="name"
            type="text"
            name="name"
            value={ user.name }
            data-testid="name-input"
            onChange={ ({ target }) => handleChange(target) }
            required
          />
          <label
            className={ `label ${focus} ${user.name.length ? valid : ''}` }
            htmlFor="name"
          >
            Name
          </label>
        </div>
        <div className="flex-center relative w-full">
          <div className="user-box">
            <input
              className="peer reset-input input"
              id="password"
              name="password"
              value={ user.password }
              type={ viewPassword ? 'text' : 'password' }
              data-testid="password-input"
              onChange={ ({ target }) => handleChange(target) }
              required
            />
            <label
              className={ `label ${focus} ${user.password.length ? valid : ''}` }
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <button
            type="button"
            className="flex-center viewpass-btn"
            onClick={ () => setViewPassword(!viewPassword) }
          >
            { viewPassword ? (
              <BsEyeSlash />
            ) : (
              <BsEye />
            )}
          </button>
        </div>
        <div className="flex-center relative w-full">
          <div className="user-box">
            <input
              className="peer reset-input input"
              id="confirmPass"
              name="confirmPass"
              value={ confirmPass }
              type={ viewConfirmPass ? 'text' : 'password' }
              data-testid="confirmPass-input"
              onChange={ ({ target }) => setConfirmPass(target.value) }
              required
            />
            <label
              className={ `label ${focus} ${confirmPass.length ? valid : ''}` }
              htmlFor="confirmPass"
            >
              Confirm Password
            </label>
          </div>
          <button
            type="button"
            className="flex-center viewpass-btn"
            onClick={ () => setViewConfirmPass(!viewConfirmPass) }
          >
            { viewConfirmPass ? (
              <BsEyeSlash />
            ) : (
              <BsEye />
            )}
          </button>
        </div>
        { emailRegister && (
          <p className="error-register">
            E-mail already registered, change it or
            {' '}
            <Link
              className="no-underline text-[var(--darkYellow)] hover:text-[var(--yellow)]"
              to="/"
            >
              login
            </Link>
            {' '}
            to proceed!
          </p>
        )}
        { user.password !== confirmPass && (
          <p className="error-register">
            Different passwords!
          </p>
        )}
        <button
          className={ `anim-hover ${classBtn}` }
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !(
            validator.isEmail(user.email)
            && user.password.length >= PASSWORD_LENGTH
            && user.password === confirmPass
            && !emailRegister
            && user.name.length >= NAME_LENGTH
          ) }
        >
          <span className="absolute block anim1 line1" />
          <span className="absolute block anim2 line2" />
          <span className="absolute block anim3 line3" />
          <span className="absolute block anim4 line4" />
          REGISTER
        </button>
      </form>
    </InitialLayout>
  );
}
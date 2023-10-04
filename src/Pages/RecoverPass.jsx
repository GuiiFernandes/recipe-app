/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import md5 from 'md5';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { IoChevronBackCircleSharp } from 'react-icons/io5';

import useFetch from '../hooks/useFetch';
import useUser from '../hooks/useUser';
import InitialLayout from '../components/InitialLayout';
import img from '../images/imgNotFounded.png';
import './NotFound.css';

const PASSWORD_LENGTH = 7;

export default function RecoverPass() {
  const [passwords, setPasswords] = useState({
    newPass: '',
    confirm: '',
  });
  const [viewPasswords, setViewPasswords] = useState({
    newPass: false,
    confirm: false,
  });
  const [userId, setUserId] = useState('');
  const { hash } = useParams();
  const { fireToast, fetchAllUsers } = useFetch();
  const { updatePassword } = useUser();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const allUsers = await fetchAllUsers();
      const userIndex = allUsers.findIndex((user) => (
        md5(user.email) === hash
      ));
      setUserId(allUsers[userIndex].id);
      if (userIndex < 0) {
        setUserId('invalid');
      }
    })();
  }, []);

  const handleChange = ({ name, value }) => {
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = async () => {
    await updatePassword(userId, passwords.newPass);
    fireToast('Password updated successfully!', 'success');
    history.push('/');
  };

  const focus = 'peer-focus:-top-5 peer-focus:text-xs';
  const valid = '-top-5 text-xs';
  const classBtnMain = 'reset-input btn-login';
  const classBtbHover = 'enabled:hover:text-[#F9EFBB] shadow-hover';
  const classBtnDisabled = 'disabled:cursor-not-allowed disabled:text-[#CF5927]';
  const classBtn = `${classBtnMain} ${classBtbHover} ${classBtnDisabled}`;

  if (userId === 'invalid') {
    return (
      <div
        className="flex justify-center items-center my-auto
      flex-col bg-notFounded glass w-1/2 mx-auto rounded-xl p-10 h-150"
      >
        <img src={ img } alt="asd" className="mt-30" />
        <h1>Page Not Found</h1>
        <button
          id="buttonNotFound"
          onClick={ () => history.push('/') }
        >
          Back To Home
        </button>
      </div>
    );
  }

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
          PASSWORD
        </h1>
      </div>
      <form
        className="flex-center flex-col gap-7 w-full max-w-sm"
        onSubmit={ (event) => {
          event.preventDefault();
          handleSubmit();
        } }
      >
        <div className="flex-center relative w-full">
          <div className="user-box">
            <input
              className="peer reset-input input"
              id="newPass"
              name="newPass"
              value={ passwords.newPass }
              type={ viewPasswords.newPass ? 'text' : 'password' }
              data-testid="password-input"
              onChange={ ({ target }) => handleChange(target) }
              required
            />
            <label
              className={ `label ${focus} ${passwords.newPass.length ? valid : ''}` }
              htmlFor="newPass"
            >
              newPass Password
            </label>
          </div>
          <button
            type="button"
            className="flex-center viewpass-btn"
            onClick={ () => setViewPasswords(!viewPasswords.newPass) }
          >
            { viewPasswords.newPass ? (
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
              id="confirm"
              name="confirm"
              value={ passwords.confirm }
              type={ viewPasswords.confirm ? 'text' : 'password' }
              data-testid="password-input"
              onChange={ ({ target }) => handleChange(target) }
              required
            />
            <label
              className={ `label ${focus} ${passwords.confirm.length ? valid : ''}` }
              htmlFor="confirm"
            >
              Confirm Password
            </label>
          </div>
          <button
            type="button"
            className="flex-center viewpass-btn"
            onClick={ () => setViewPasswords(!viewPasswords.confirm) }
          >
            { viewPasswords.confirm ? (
              <BsEyeSlash />
            ) : (
              <BsEye />
            )}
          </button>
        </div>

        <button
          className={ `anim-hover ${classBtn}` }
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !(
            passwords.newPass.length >= PASSWORD_LENGTH
            && passwords.confirm.length >= PASSWORD_LENGTH
            && passwords.newPass === passwords.confirm
          ) }
        >
          <span className="absolute block anim1 line1" />
          <span className="absolute block anim2 line2" />
          <span className="absolute block anim3 line3" />
          <span className="absolute block anim4 line4" />
          UPDATE
        </button>
      </form>
    </InitialLayout>
  );
}

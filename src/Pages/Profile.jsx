/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import validator from 'validator';
import { AiOutlineEdit } from 'react-icons/ai';

import RecipesContext from '../context/RecipesContext';
import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';
import Header from '../components/Header';
import EditUserInfo from '../components/EditUserInfo';
import EditUserPass from '../components/EditUserPass';
import Comments from '../components/Comments';
import ProfileErrors from '../components/ProfileErrors';
import { getId } from '../utils/functions';
import './Login.css';
import './Profile.css';

const NAME_LENGTH = 3;
const PASSWORD_LENGTH = 7;

function Profile() {
  const { userLogged } = useContext(RecipesContext);
  const { fetchUser, patchUser, fireToast } = useFetch();
  const { validateCookie } = useUser();
  const [passwords, setPasswords] = useState(
    { lastPass: '', newPass: '', confirmPass: '', validLastPass: true },
  );
  const [editPass, setEditPass] = useState(false);
  const [emailRegister, setEmailRegister] = useState(false);
  const [user, setUser] = useState({
    email: '',
    name: '',
    photo: '',
    acceptCookies: false,
  });

  useEffect(() => {
    (async () => {
      const isLogged = await validateCookie();
      if (!isLogged) return;
      const id = getId('userLogged');
      const { email, name, photo, acceptCookies } = await fetchUser({ id });
      setUser({ email, name, photo, acceptCookies });
    })();
  }, []);

  const { name, email, photo, acceptCookies } = userLogged
  || { name: '', email: '', photo: '', acceptCookies: false };

  const { lastPass, newPass, confirmPass, validLastPass } = passwords
    || { lastPass: '', newPass: '', confirmPass: '', validLastPass: true };

  const handleSubmit = async () => {
    patchUser(userLogged.id, user, photo);
    fireToast('Saved Changes!', 'success');
  };

  const verifyDisabled = () => {
    if (editPass) {
      return (
        newPass === confirmPass
        && newPass.length >= PASSWORD_LENGTH
        && lastPass.length >= PASSWORD_LENGTH
        && validLastPass
        && newPass !== lastPass
      );
    }
    return (
      validator.isEmail(email)
        && !emailRegister
        && name.length >= NAME_LENGTH
        && (user.name !== name || user.email !== email
          || user.photo !== photo || user.acceptCookies !== acceptCookies)
    );
  };

  return (
    <>
      <Header title="Profile" iconeProfile />
      <main
        className="recipe-box flex flex-col items-center bg-form glass box-bottom gap-3"
      >
        <EditUserInfo
          user={ user }
          setUser={ setUser }
          setEmailRegister={ setEmailRegister }
        />
        <div className="flex flex-row">
          <button
            className="button"
            onClick={ () => {
              setEditPass(!editPass);
            } }
          >
            <AiOutlineEdit className="svg-icon" />
            <span className="lable">{ editPass ? 'Cancel Edit Pass' : 'Edit Pass'}</span>
          </button>
        </div>
        <div>
          { editPass && (
            <EditUserPass passwords={ passwords } setPasswords={ setPasswords } />
          )}
        </div>
        <ProfileErrors
          editPass={ editPass }
          emailRegister={ emailRegister }
          passwords={ passwords }
        />
        <div className="space-x-5">
          <button
            className="button"
            type="submit"
            disabled={ !(verifyDisabled()) }
            onClick={ handleSubmit }
          >
            {editPass ? 'Save New Pass' : 'Save Changes Infos'}
          </button>
        </div>
        <div className="w-full max-w-lg mt-2">
          <h3 className="self-start text-white">Assessments: </h3>
          <Comments />
        </div>
      </main>
    </>
  );
}

export default Profile;

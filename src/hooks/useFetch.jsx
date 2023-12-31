import { useContext } from 'react';
import Swal from 'sweetalert2';

import md5 from 'md5';
import { fetchAPI, fetchComments, fetchNewUser, fetchPatchUser,
  fetchPublicRecipes,
  fetchUserEmail, fetchUserId, fetchUsers } from '../services/fetchAPI';
import RecipesContext from '../context/RecipesContext';
import { Toast, setCookie } from '../utils/functions';
import { uploadImage } from '../services/firebase';

const useFetch = () => {
  const { setRecipes, setCategories, setLoading, userLogged,
    setError, error, setUserLogged } = useContext(RecipesContext);
  const MAX_RECIPES = 12;
  const MAX_CATEGORIES = 5;

  const fetchRecipes = async (pathname, optSearch = 'name', textSearch = '') => {
    try {
      setLoading(true);
      return await fetchAPI(pathname, optSearch, textSearch);
    } catch ({ message }) {
      console.error(message);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fireToast = (title, icon = 'error') => {
    Toast.fire({
      icon,
      title,
      background: 'var(--darkGray)',
      color: 'var(--yellow)',
    });
  };

  const sweetAlert = (fn, ...params) => Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    background: 'var(--darkGray)',
    color: 'var(--yellow)',
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonColor: 'var(--orange)',
    cancelButtonColor: 'var(--darkYellow)',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'swal-confirm',
      cancelButton: 'swal-cancel',
    },
  }).then((result) => {
    console.log(params);
    if (result.isConfirmed) {
      fn(...params);
      fireToast('Deleted!', 'success');
    }
  });

  const initialFetch = async (pathname) => {
    const type = pathname.includes('/meals') ? 'meal' : 'drink';
    const recipesData = pathname.includes('users')
      ? await fetchPublicRecipes(
        ['strType', '_sort', '_order'],
        [type, 'strCreateAt', 'desc'],
      )
      : await fetchRecipes(pathname);

    const categoriesData = await fetchRecipes(pathname, 'categoriesList', 'list');
    if (error) {
      fireToast(`${error}. Please, try again later.`);
      setRecipes([]);
    } else {
      setRecipes(recipesData.slice(0, MAX_RECIPES));
      setCategories(categoriesData.slice(0, MAX_CATEGORIES));
    }
  };

  const fetchUser = async ({ id = null, email = null, password = null }) => {
    try {
      setLoading(true);
      if (email) return await fetchUserEmail(email, password);
      if (id) return await fetchUserId(id);
      throw new Error('fetchUser needs at least one parameter (id or email');
    } catch ({ message }) {
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      return await fetchUsers();
    } catch ({ message }) {
      setError(message);
      return [];
    }
  };

  const postNewUser = async (newUser) => {
    try {
      setLoading(true);
      const id = await fetchNewUser(newUser);
      if (newUser.AcceptCookies) {
        setCookie('userLogged', id);
      } else {
        sessionStorage.setItem('userLogged', id);
      }
      return true;
    } catch ({ message }) {
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const checkUserExist = async (email, id = null) => {
    const userResponse = await fetchUserEmail(email);
    console.log(id, userResponse[0].id);
    return (id && userResponse.length)
      ? id !== userResponse[0].id : !!userResponse.length;
  };

  const loginUser = async ({ email, password }) => {
    const userResponse = await fetchUserEmail(email, password);
    if (userResponse.length) {
      if (userResponse[0].acceptCookies) {
        setCookie('userLogged', userResponse[0].id);
      } else {
        sessionStorage.setItem('userLogged', userResponse[0].id);
      }
      return true;
    }
    fireToast('Invalid email or password');
    return false;
  };

  const patchUser = async (id, data) => {
    try {
      const newData = { ...data };
      if (newData.password) {
        newData.password = md5(newData.password);
      }
      if (data.photo instanceof Object) {
        newData.photo = await uploadImage(id, data.photo);
        setUserLogged({ ...userLogged, photo: newData.photo });
      }
      await fetchPatchUser(id, newData);
    } catch ({ message }) {
      setError(message);
      return [];
    }
  };

  const fetchRecipeComments = async (key, value) => {
    try {
      return await fetchComments(key, value);
    } catch ({ message }) {
      setError(message);
      return [];
    }
  };

  const fetchCategories = async (pathname) => {
    try {
      setLoading(true);
      const categoriesData = await fetchRecipes(pathname, 'categoriesList', 'list');
      setCategories(categoriesData);
    } catch ({ message }) {
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchRecipes,
    initialFetch,
    fireToast,
    fetchUser,
    postNewUser,
    loginUser,
    checkUserExist,
    patchUser,
    fetchRecipeComments,
    sweetAlert,
    fetchCategories,
    fetchAllUsers,
  };
};

export default useFetch;

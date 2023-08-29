import Swal from 'sweetalert2';

const HOURS = 6;

export const initialIngredients = (ingredients) => ingredients
  .reduce((obj, [key]) => ({
    ...obj,
    [key]: '',
  }), {});

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const setCookie = (key, id) => {
  const date = new Date();
  date.setHours(date.getHours() + HOURS);
  document.cookie = `${key}=${(id)};expires=${date.toGMTString()};path=/`;
};

export const getId = (key) => {
  const cookies = document.cookie.split(';');
  if (!cookies[0]) {
    return sessionStorage.getItem(key);
  }
  const cookie = cookies.find((c) => c.includes(key));
  return cookie ? cookie.split('=')[1] : null;
};

export const deleteCookie = (key) => {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const ELEVEN = 11;

export const getYoutubeEmbed = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === ELEVEN)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

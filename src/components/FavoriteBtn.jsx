/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import RecipesContext from '../context/RecipesContext';
import useUser from '../hooks/useUser';
import './FavoriteBtn.css';

const NEGATIVE_ONE = -1;

export default function FavoriteBtn({ recipe }) {
  const { userLogged } = useContext(RecipesContext);
  const { changeFavorite } = useUser();
  const { pathname } = useLocation();
  const [isFavorite, setIsFavorite] = useState(() => false);

  const NAME_URL = pathname.split('/')[1];
  const BASE_KEY = NAME_URL === 'meals' ? 'Meal' : 'Drink';

  const formatRecipe = NAME_URL === 'favorite-recipes'
    ? recipe
    : {
      id: recipe[`id${BASE_KEY}`],
      type: NAME_URL.slice(0, NEGATIVE_ONE),
      nationality: recipe.strArea || '',
      category: recipe.strCategory || '',
      alcoholicOrNot: recipe.strAlcoholic || '',
      name: recipe[`str${BASE_KEY}`],
      image: recipe[`str${BASE_KEY}Thumb`],
    };

  useEffect(() => {
    const { favorites } = userLogged || { favorites: [] };
    setIsFavorite(favorites.some(({ id, type }) => id === formatRecipe.id && type === formatRecipe.type));
  }, [userLogged]);

  const handleClick = async () => {
    await changeFavorite(formatRecipe, formatRecipe.type, !isFavorite);
    setIsFavorite(!isFavorite);
  };

  return (
    <label className="container-like">
      <input checked={ isFavorite } onChange={ handleClick } type="checkbox" />
      <div className="checkmark">
        <svg viewBox="0 0 256 256">
          <rect fill="none" height="256" width="256" />
          <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="16px" stroke="var(--yellow)" fill="none" />
        </svg>
      </div>
    </label>
  );
}

FavoriteBtn.propTypes = {
  recipe: PropTypes.instanceOf(Object).isRequired,
};

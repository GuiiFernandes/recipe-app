import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TbSearch, TbSearchOff } from 'react-icons/tb';

import iconLogo from '../images/icon-recipes-app.svg';
import nameLogo from '../images/name-recipes-app.svg';
import iconFoods from '../images/icon-foods.svg';
import iconDrinks from '../images/icon-drinks.svg';
import SearchBar from './SearchBar';
import './Header.css';

function Header({ title, iconeProfile = false, iconeSearch = false }) {
  // Definindo o estado showSearchBar com o valor inicial false
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const pathSvg1 = 'M27 10 13 10C10.8 10 9 8.2 9 6 9 ';
  const pathSvg2 = '3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 ';
  const pathSvg3 = '30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22';
  const pathSvgFull = `${pathSvg1}${pathSvg2}${pathSvg3}`;

  return (
    <header>
      <div className="header">
        <div className="flex-center">
          <img src={ iconLogo } alt="icon logo" className="w-9" />
          <img src={ nameLogo } alt="name logo" />
        </div>
        {/* Verifica se iconeSearch é true */}
        <nav className="flex gap-x-3">
          {iconeSearch && (
          // Botão para mostrar/ocultar a barra de pesquisa
            <button
              className="reset-btn w-10 h-10 overflow-hidden"
              type="button"
              onClick={ () => setShowSearchBar(!showSearchBar) }
            >
              { showSearchBar ? (
                <TbSearchOff size="30px" color="#7D8C00" />
              ) : (
                <TbSearch size="30px" color="#7D8C00" />
              )}
            </button>
          )}
          {/* Verifica se iconeProfile é true */}
          {iconeProfile && (
          // Link para a página de perfil
            <label className="flex-center hamburguer cursor-pointer">
              <input
                className="hidden"
                type="checkbox"
                checked={ menuOpen }
                onChange={ () => setMenuOpen(!menuOpen) }
              />
              <svg
                className="menu-trans"
                viewBox="0 0 32 32"
              >
                <path
                  className="line line-top-bottom"
                  d={ pathSvgFull }
                />
                <path className="line" d="M7 16 27 16" />
              </svg>
            </label>
          )}
        </nav>
      </div>
      <div className="bg-[#262321] flex-center flex-col gap-y-2 pb-6 pt-[72px]">
        <img
          className="w-12"
          src={ pathname === '/meals' ? iconFoods : iconDrinks }
          alt="icon type"
        />
        <h1
          className="title"
          data-testid="page-title"
        >
          {title}
        </h1>
      </div>

      {/* Verifica se showSearchBar é true */}
      {showSearchBar && (
        // Renderiza o componente SearchBar passando a função setPesquisa como prop
        <SearchBar />
      )}
    </header>
  );
}

// PropTypes vazio para indicar que nenhuma propriedade é requerida
Header.propTypes = {
  title: PropTypes.string.isRequired,
}.isRequired;

// Exporta o componente Header utilizando React.memo para otimização de renderização
export default Header;

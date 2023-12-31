import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Recipes from './Pages/Recipes';
import Login from './Pages/Login';
import DoneRecipes from './Pages/DoneRecipes';
import Profile from './Pages/Profile';
import Recipe from './Pages/Recipe';
import NotFound from './Pages/NotFound';
import FavoriteRecipes from './Pages/FavoriteRecipes';
import Register from './Pages/Register';
import RememberPass from './Pages/RememberPass';
import Ranking from './Pages/Ranking';
import RecipesInProgress from './Pages/RecipesInProgress';
import MyRecipes from './Pages/MyRecipes';
import './App.css';
import About from './Pages/About';
import RecipesUsers from './Pages/RecipesUsers';
import RecoverPass from './Pages/RecoverPass';

function App() {
  return (
    <Switch>
      <Route path="/" component={ Login } exact />
      <Route path="/meals" component={ Recipes } exact />
      <Route path="/drinks" component={ Recipes } exact />
      <Route path="/meals/users" component={ RecipesUsers } exact />
      <Route path="/drinks/users" component={ RecipesUsers } exact />
      <Route path="/meals/:id" component={ Recipe } exact />
      <Route path="/drinks/:id" component={ Recipe } exact />
      <Route path="/meals/users/:id" component={ Recipe } exact />
      <Route path="/drinks/users/:id" component={ Recipe } exact />
      <Route path="/meals/:id/in-progress" component={ Recipe } />
      <Route path="/drinks/:id/in-progress" component={ Recipe } />
      <Route path="/meals/users/:id/in-progress" component={ Recipe } />
      <Route path="/drinks/users/:id/in-progress" component={ Recipe } />
      <Route path="/profile" component={ Profile } />
      <Route path="/done-recipes" component={ DoneRecipes } />
      <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      <Route path="/signup" component={ Register } />
      <Route path="/remember-password" component={ RememberPass } />
      <Route path="/ranking" component={ Ranking } />
      <Route path="/in-progress-recipes" component={ RecipesInProgress } />
      <Route path="/my-recipes" component={ MyRecipes } />
      <Route path="/about" component={ About } />
      <Route path="/recover-pass/:hash" component={ RecoverPass } />
      <Route path="*" component={ NotFound } />
    </Switch>
  );
}

export default App;

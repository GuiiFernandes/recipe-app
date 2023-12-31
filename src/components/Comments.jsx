/* eslint-disable react/jsx-max-depth */
/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

import RecipesContext from '../context/RecipesContext';
import useFetch from '../hooks/useFetch';
import CommentLikedBtn from './CommentLikedBtn';
import { getId } from '../utils/functions';

const TEEN = 10;

function Comments({ inRecipe = false }) {
  const { comments, setComments } = useContext(RecipesContext);
  const { fetchRecipeComments } = useFetch();
  const { fetchAllUsers } = useFetch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchAllUsers();
      setUsers(data);
      if (!inRecipe) {
        const dataComments = await fetchRecipeComments('userId', getId('userLogged'));
        setComments(dataComments);
      }
    })();
  }, []);

  const star = '★';
  const MAX_COMMENTS = inRecipe ? TEEN : comments.length;

  if (users.length) {
    return (
      <div className="flex flex-col w-full items-center">
        {comments.slice(0, MAX_COMMENTS)
          .sort((a, b) => (
            ((b.liked.length + b.disliked.length) - (a.liked.length + a.disliked.length))
          )).map((comment) => {
            const { name, photo } = users.find(({ id }) => id === comment.userId);
            return (
              <div
                key={ comment.id }
                className="comment-container"
              >
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    { inRecipe && (
                      <div>
                        {photo ? (
                          <img
                            src={ photo }
                            alt="foto"
                            className="w-10 h-10 flex self-start rounded-full"
                          />)
                          : (
                            <CgProfile
                              className="rounded-full w-[45px] h-[45px] bg-[var(--yellow)] text-black"
                            />)}
                      </div>
                    )}
                    <div>
                      { inRecipe ? (
                        <p className="mb-0 text-white">{name}</p>
                      ) : (
                        <Link
                          to={ `/${comment.recipeType}s/${comment.recipeId}` }
                          className="mb-0 text-white"
                        >
                          {comment.recipeName}
                        </Link>
                      )}
                      <div className="flex items-center gap-x-2 min-w-[120px]">
                        <p className="mb-0 text-white">{`${comment.rating},0  `}</p>
                        <p className="mb-0 text-[#ffa723] text-[20px]">
                          {Array.from({ length: comment.rating }, () => star).join('')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CommentLikedBtn comment={ comment } inRecipe={ inRecipe } />
                </div>
                <p className="text-white break-words m-0">{comment.comment}</p>
              </div>
            );
          })}
      </div>
    );
  }
}

Comments.propTypes = {
  inRecipe: PropTypes.bool,
};

export default Comments;

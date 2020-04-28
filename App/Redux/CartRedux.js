import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import R from 'ramda';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  addToCart: ['data'],
  updateItemInCart: ['data'],
  removeItemFromCart: ['data'],
});

export const CartTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  activeCart: {},
});

/* ------------- Selectors ------------- */

export const CartSelectors = {
  getData: state => state.data,
};

/* ------------- Reducers ------------- */

export const addToCartReducer = (state, {data}) => {
  let activeCart = {...state.activeCart};
  activeCart = {
    ...activeCart,
    [data.id]: data,
  };
  return state.merge({activeCart});
};

export const updateItemInCartReducer = (state, {data}) => {
  let activeCart = {...state.activeCart};
  activeCart = {
    ...activeCart,
    [data.id]: data,
  };
  return state.merge({activeCart});
};

export const removeItemFromCartReducer = (state, {data}) => {
  let activeCart = {...state.activeCart};
  activeCart = R.dissocPath([data.id], activeCart);

  return state.merge({activeCart});
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_TO_CART]: addToCartReducer,
  [Types.UPDATE_ITEM_IN_CART]: updateItemInCartReducer,
  [Types.REMOVE_ITEM_FROM_CART]: removeItemFromCartReducer,
});

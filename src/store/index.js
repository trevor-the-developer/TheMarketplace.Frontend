import { createStore } from 'vuex';
import auth from './modules/auth';
import listings from './modules/listings';
import cards from './modules/cards';

export default createStore({
  modules: {
    auth,
    listings,
    cards
  }
});
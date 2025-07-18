import { createStore } from 'vuex';
import auth from './modules/auth';
import listings from './modules/listings';
import cards from './modules/cards';
import products from './modules/products';
import productDetails from './modules/productDetails';
import media from './modules/media';

export default createStore({
  modules: {
    auth,
    listings,
    cards,
    products,
    productDetails,
    media
  }
});

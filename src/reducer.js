export const initialState = {
  cart: [],
  bookmarks: [],
  products: [],
  user: null,
  loadingBar: null,
  category: "all",
  fuse: null,
};

const getCartTotal = (cart) =>
  cart
    ?.reduce((amount, item) => item.price * item.quantity + amount, 0)
    .toFixed(2);

const getTotalItems = (cart) =>
  cart?.reduce((total, item) => item.quantity + total, 0);

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_CART": {
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === action.item.id
      );
      let newCart = [...state.cart];
      if (itemIndex >= 0) {
        newCart[itemIndex].quantity += 1;
      } else {
        newCart = [...state.cart, action.item];
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return {
        ...state,
        cart: newCart,
      };
    }

    case "REMOVE_FROM_CART": {
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === action.id
      );
      let newCart = [...state.cart];
      if (itemIndex >= 0) {
        if (newCart[itemIndex].quantity > 1) {
          newCart[itemIndex].quantity -= 1;
        } else {
          newCart.splice(itemIndex, 1);
        }
      } else {
        console.warn("Item Not Found");
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return {
        ...state,
        cart: newCart,
      };
    }

    case "REMOVE_ALL_ITEMS": {
      const itemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === action.id
      );
      let newCart = [...state.cart];
      if (itemIndex >= 0) {
        newCart.splice(itemIndex, 1);
      } else {
        console.warn("Item Not Found");
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      return {
        ...state,
        cart: newCart,
      };
    }

    case "ADD_TO_BOOKMARKS": {
      const itemIndex = state.bookmarks.findIndex(
        (cartItem) => cartItem.id === action.item.id
      );
      let newBookmarks = [...state.bookmarks];
      if (itemIndex >= 0) {
        newBookmarks.splice(itemIndex, 1);
      } else {
        newBookmarks = [...state.bookmarks, action.item];
      }
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      return {
        ...state,
        bookmarks: newBookmarks,
      };
    }

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_FUSE":
      return {
        ...state,
        fuse: action.fuse,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        category: action.category,
      };

    case "RESTORE_BOOKMARKS":
      return {
        ...state,
        bookmarks: action.bookmarks,
      };

    case "RESTORE_CART":
      return {
        ...state,
        cart: action.cart,
      };

    case "EMPTY_CART":
      localStorage.removeItem("cart");
      return {
        ...state,
        cart: [],
      };

    case "LOADING_BAR":
      return {
        ...state,
        loadingBar: action.loadingBar,
      };

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.products,
      };

    default:
      return state;
  }
};

export default reducer;
export { getCartTotal, getTotalItems };

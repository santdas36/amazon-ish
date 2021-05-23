import React from "react";
import "./Bookmarks.css";
import { useStateValue } from "../StateProvider";
import Product from "./Product";
import emptyBookmarks from "../assets/emptyBookmarks.svg";
import { Link } from "react-router-dom";

function Bookmarks() {
  const [{ bookmarks }] = useStateValue();

  return (
    <div className="bookmarks">
      <h4>Bookmarks</h4>
      {bookmarks.length > 0 ? (
        <div className="products">
          {bookmarks.map((product) => (
            <Product id={product.id} item={product} />
          ))}
        </div>
      ) : (
        <div className="cart__inner bookmark__inner">
          <div className="cart__items">
            <img src={emptyBookmarks} className="cart__empty" />
          </div>
          <div className="cart__checkout">
            <h4>It's empty here.</h4>
            <p style={{ marginBottom: "3rem" }}>
              Something's catching your eye? Add your favorite items to
              Bookmarks, and check them out anytime you wish.
            </p>
            <div className="buttons">
              <Link to="/">
                <button className="buttonPrimary">Go Shopping</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Bookmarks;

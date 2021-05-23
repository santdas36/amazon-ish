import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ProductSingle.css";
import defaultImage from "../assets/default.jpg";
import TextTruncate from "react-text-truncate";
import Product from "./Product";
import LabelImportantRoundedIcon from "@material-ui/icons/LabelImportantRounded";
import AddShoppingCartRoundedIcon from "@material-ui/icons/AddShoppingCartRounded";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import BookmarkRoundedIcon from "@material-ui/icons/BookmarkRounded";
import ReactTooltip from "react-tooltip";
import { useStateValue } from "../StateProvider";
import db from "../firebase";
import { motion } from "framer-motion";
import { shuffleArray } from "../util";

function ProductSingle() {
  const { id } = useParams();
  const location = useLocation();
  console.log(location.state.product);

  const [productDetails, setProductDetails] = useState({});
  const [features, setFeatures] = useState([]);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [{ cart, bookmarks, products, loadingBar }, dispatch] = useStateValue();

  useEffect(() => {
    if (loadingBar) {
      loadingBar.current.continuousStart();
    }
    db.collection("products")
      .doc(id)
      .get()
      .then((snapshot) => {
        setProductDetails(snapshot.data());
      })
      .then(() => {
        if (loadingBar) {
          loadingBar.current.complete();
        }
      });
  }, [id]);

  const addToCart = (item) => {
    dispatch({
      type: "ADD_TO_CART",
      item: {
        ...productDetails,
        id: id,
        quantity: 1,
      },
    });
  };

  const addToBookmarks = (item) => {
    dispatch({
      type: "ADD_TO_BOOKMARKS",
      item: {
        ...productDetails,
        id: id,
      },
    });
  };

  useEffect(() => {
    setSuggestions(shuffleArray(products));
  }, [products]);

  useEffect(() => {
    const bIndex = bookmarks.findIndex((item) => item.id === id);
    if (bIndex >= 0) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }

    const cIndex = cart.findIndex((item) => item.id === id);
    if (cIndex >= 0) {
      setIsAdded(true);
    } else {
      setIsAdded(false);
    }
  }, [bookmarks, cart, products, id]);

  return (
    <div className="productSingle">
      <div className="productSingle__inner">
        <motion.div layoutId={id} className="productSingle__image">
          <img src={productDetails?.imgUrl || location.state.product?.imgUrl} />
        </motion.div>
        <div className="productSingle__details">
          <TextTruncate
            line={3}
            element="h5"
            containerClassName="productSingle__name"
            truncateText="…"
            text={productDetails?.name || location.state.product?.name}
          />
          <ul className="productSingle__features">
            {location.state.product?.feature.map((features) => (
              <li>{features}</li>
            ))}
          </ul>
          <span className="productSingle__footer">
            <p className="productSingle__price">
              <h4>${productDetails?.price || location.state.product?.price}</h4>{" "}
              {(productDetails?.discount ||
                location.state.product?.discount) && (
                <small>
                  <del>
                    $
                    {productDetails?.originalPrice ||
                      location.state.product?.originalPrice}
                  </del>
                </small>
              )}
            </p>
            {(productDetails?.price > 25 ||
              location.state.product?.price > 25) && (
              <p className="productSingle__deliveryMessage">
                <LabelImportantRoundedIcon
                  style={{
                    fill: "transparent",
                    stroke: "currentColor",
                    strokeWidth: 1,
                    fontSize: 20,
                  }}
                />
                Free Delivery Available - Salem, India 636006
              </p>
            )}
            <div className="buttons">
              {isAdded ? (
                <button className="buttonPrimary">
                  <ShoppingCartRoundedIcon /> Added
                </button>
              ) : (
                <button className="buttonPrimary" onClick={addToCart}>
                  <AddShoppingCartRoundedIcon /> Add To Cart
                </button>
              )}
              <button
                data-tip={isBookmarked ? "Remove" : "Bookmark"}
                data-for="bookmarkTooltip"
                className="buttonSecondary"
                onClick={addToBookmarks}
              >
                <BookmarkRoundedIcon
                  style={{
                    fill: isBookmarked ? "#fff" : "transparent",
                    stroke: "#fff",
                    strokeWidth: 2,
                    fontSize: 20,
                  }}
                />
              </button>
              <ReactTooltip
                place="right"
                className="app__toolTip"
                id="bookmarkTooltip"
                backgroundColor="#1a1a2cee"
                effect="solid"
              />
            </div>
          </span>
        </div>
      </div>
      <div className="productSingle__suggested">
        <h5 style={{ marginTop: "3rem", marginBottom: "1rem" }}>
          You might also like
        </h5>
        <div className="products">
          {suggestions
            ?.slice(0, 3)
            .map((product) =>
              product.id != id ? (
                <Product id={product.id} item={product.data()} />
              ) : null
            )}
        </div>
      </div>
    </div>
  );
}
export default ProductSingle;

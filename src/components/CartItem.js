import React from "react";
import "./CartItem.css";
import TextTruncate from "react-text-truncate";
import RemoveShoppingCartRoundedIcon from "@material-ui/icons/RemoveShoppingCartRounded";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { motion } from "framer-motion";
import { errorAnim } from "../util";

function CartItem({ item }) {
  const [{ cart }, dispatch] = useStateValue();

  const plusQuantity = () => {
    dispatch({
      type: "ADD_TO_CART",
      item: {
        id: item.id,
      },
    });
  };

  const minusQuantity = () => {
    dispatch({
      type: "REMOVE_FROM_CART",
      id: item.id,
    });
  };

  const removeItem = () => {
    dispatch({
      type: "REMOVE_ALL_ITEMS",
      id: item.id,
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={errorAnim}
      className="cartItem"
      key={item.id}
      id={item.id}
    >
      <motion.div layoutId={item.id} className="cartItem__image">
        <img src={item.imgUrl} />
      </motion.div>
      <div className="cartItem__details">
        <Link
          to={{ pathname: `/product/${item.id}`, state: { product: item } }}
        >
          <TextTruncate
            line={2}
            element="p"
            containerClassName="cartItem__name"
            truncateText="…"
            text={item.name}
          />
        </Link>
        <div className="cartItem__footer">
          <p className="cartItem__price">
            <b>${(item.price * item.quantity).toFixed(2)}</b>{" "}
            {item.discount && (
              <small>
                <del>${(item.originalPrice * item.quantity).toFixed(2)}</del>
              </small>
            )}
          </p>
          <div className="cartItem__buttons">
            <button onClick={minusQuantity}>-</button>
            <span>{item.quantity}</span>
            <button onClick={plusQuantity}>+</button>
          </div>
          <div className="cartItem__remove">
            <button
              onClick={removeItem}
              data-for="removeTooltip"
              data-tip="Remove from Cart"
              className="buttonRed"
            >
              <RemoveShoppingCartRoundedIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;

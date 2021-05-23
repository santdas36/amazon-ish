import React from "react";
import "./Product.css";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";
import TextTruncate from "react-text-truncate";
import defaultImage from "../assets/default.jpg";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { pageZoom, pageTransition } from "../util";

function Product({ item, id }) {
  const history = useHistory();

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageZoom}
      transition={pageTransition}
      layout
      onClick={() => history.push(`/product/${id}`, { product: item })}
      className="product"
    >
      <motion.div layoutId={id} className="product__image">
        {item.discount && <span className="banner">Offer!</span>}
        <img src={item.imgUrl || defaultImage} />
      </motion.div>
      <div className="product__details">
        <span className="product__category">{item.category}</span>
        <TextTruncate
          line={3}
          element="h6"
          containerClassName="product__name"
          truncateText="…"
          text={item.name}
        />
        <div className="product__footer">
          <p className="product__price">
            <b>${item.price}</b>{" "}
            {item.discount && (
              <small>
                <del>${item.originalPrice}</del>
              </small>
            )}
          </p>
          <div className="product__rating">
            <StarRateRoundedIcon style={{ color: "#f90" }} />
            {item.rating}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default Product;

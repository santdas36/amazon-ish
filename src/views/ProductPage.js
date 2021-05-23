import React from "react";
import { motion } from "framer-motion";
import ProductSingle from "../components/ProductSingle";
import { pageTransition, pageZoom } from "../util";

function Cart() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageZoom}
      transition={pageTransition}
    >
      <ProductSingle />
    </motion.div>
  );
}
export default Cart;

import React from "react";
import Cart from "../components/Cart";
import { motion } from "framer-motion";
import { pageTransition, pageZoom } from "../util";

function CartPage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageZoom}
      transition={pageTransition}
    >
      <Cart />
    </motion.div>
  );
}
export default CartPage;

import React from "react";
import Bookmarks from "../components/Bookmarks";
import { motion } from "framer-motion";
import { pageTransition, pageZoom } from "../util";

function BookmarkPage() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageZoom}
      transition={pageTransition}
    >
      <Bookmarks />
    </motion.div>
  );
}
export default BookmarkPage;

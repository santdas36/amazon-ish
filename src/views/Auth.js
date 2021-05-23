import React from "react";
import { useQuery } from "../util";
import Login from "../components/Login";
import PasswordReset from "../components/PasswordReset";
import { motion } from "framer-motion";
import { pageTransition, pageSlide } from "../util";

function Auth() {
  const query = useQuery();

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageSlide}
      transition={pageTransition}
    >
      {query.get("mode") === "verifyEmail" && <Login />}
      {query.get("mode") === "resetPassword" && <PasswordReset />}
    </motion.div>
  );
}

export default Auth;

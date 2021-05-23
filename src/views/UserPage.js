import React from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Welcome from "../components/Welcome";
import PasswordReset from "../components/PasswordReset";
import Profile from "../components/Profile";
import { motion } from "framer-motion";
import { pageTransition, pageSlide } from "../util";

function UserPage({ type }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageSlide}
      transition={pageTransition}
    >
      {type === "login" && <Login />}
      {type === "signup" && <Signup />}
      {type === "welcome" && <Welcome />}
      {type === "passwordReset" && <PasswordReset />}
      {type === "profile" && <Profile />}
    </motion.div>
  );
}
export default UserPage;

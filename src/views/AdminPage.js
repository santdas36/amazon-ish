import React, { useEffect, useState } from "react";
import Admin from "../components/Admin";
import { motion } from "framer-motion";
import { pageTransition, pageSlide } from "../util";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
      } else {
        setLoading(false);
        history.replace("/login?next=admin");
      }
    });
  }, []);

  return (
    <div>
      {loading ? (
        <p style={{ padding: "3rem" }}>Checking access...</p>
      ) : (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageSlide}
          transition={pageTransition}
        >
          <Admin />
        </motion.div>
      )}
    </div>
  );
}
export default AdminPage;

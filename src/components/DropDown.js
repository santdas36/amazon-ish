import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import "./DropDown.css";
import { motion } from "framer-motion";

function DropDown({ className, items, defaultItem }) {
  const [selected, setSelected] = useState(defaultItem || "Not Selected");
  const [dropDown, setDropDown] = useState(false);

  return (
    <span
      className={`dropDown ${className} ${dropDown && "dropDownOpen"}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropDown((dropDown) => !dropDown);
      }}
    >
      {selected} <KeyboardArrowDownRoundedIcon className="dropDown__icon" />
      {dropDown && (
        <motion.ul
          className="dropDown__menu"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-10%" }}
        >
          {items.map((item) => (
            <li
              onClick={(e) => {
                setSelected(item);
                setDropDown(false);
                e.stopPropagation();
              }}
            >
              {item}
            </li>
          ))}
        </motion.ul>
      )}
    </span>
  );
}
export default DropDown;

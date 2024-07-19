import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import amazonLogo from "../assets/logo.png";
import { useStateValue } from "../StateProvider";
import DropDown from "./DropDown";
import "./Header.css";
import "./SearchResults.css";

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Tamil",
  "Hindi",
  "Chinese",
  "Russian",
  "Japanese",
  "Arabic",
];

function Header() {
  const location = useLocation();
  const history = useHistory();
  const queryRef = useRef(null);
  const [results, setResults] = useState(null);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [{ fuse }] = useStateValue();

  const handleChange = (e) => {
    if (queryRef.current.value.length > 0) {
      setResults(fuse.search(queryRef.current.value));
      setResultsOpen(true);
    } else {
      setResults(null);
      setResultsOpen(false);
    }
  };

  return (
    <div className="header">
      <div className="header__nav">
        {location.pathname !== "/" && (
          <button onClick={() => history.goBack()} className="header__back">
            Back
          </button>
        )}
        <div className="header__search">
          <SearchRoundedIcon className="header__searchIcon" />
          <input
            type="text"
            ref={queryRef}
            onChange={handleChange}
            placeholder="Search..."
          />
        </div>
        {resultsOpen && (
          <motion.div
            className="results noScrollbar"
            initial={{ opacity: 0, y: "-1rem" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-1rem" }}
          >
            {results.map((result) => (
              <div
                onClick={() => {
                  setResultsOpen(false);
                  queryRef.current.value = "";
                  history.push(`/product/${result.item.id}`, {
                    product: result.item,
                  });
                }}
                className="result"
              >
                <div className="result__image">
                  <img src={result.item.imgUrl} />
                </div>
                <span>
                  <p className="result__title">{result.item.name}</p>
                  <small className="result__desc">
                    {result.item.feature[0]}
                  </small>
                </span>
              </div>
            ))}
          </motion.div>
        )}
        <DropDown
          className="header__langDropDown"
          items={languages}
          defaultItem={languages[0]}
        />
        <img src={amazonLogo} className="header__logo" />
      </div>
    </div>
  );
}
export default Header;

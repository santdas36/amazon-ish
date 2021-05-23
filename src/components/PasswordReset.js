import React, { useState } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import { useQuery, errorAnim } from "../util";
import { useStateValue } from "../StateProvider";

function PasswordReset() {
  const [{ loadingBar }] = useStateValue();
  const query = useQuery();
  const history = useHistory();

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (value) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };

  const sendResetLink = async (email) => {
    auth
      .sendPasswordResetEmail(email)
      .then((response) => {
        console.log(response);
        setEmail("");
        setPassword("");
        setFormError("Check your mail for the password reset link.");
        setStatus(false);
        loadingBar.current.complete();
        setSuccess(true);
      })
      .catch((error) => {
        setFormError(error.message);
        setStatus(false);
        loadingBar.current.complete();
        setSuccess(false);
      });
  };

  const resetPassword = (newPassword) => {
    auth
      .confirmPasswordReset(query.get("oobCode"), newPassword)
      .then((response) => {
        console.log(response);
        setEmail("");
        setPassword("");
        setFormError("Success. Login to continue!");
        setSuccess(true);
        loadingBar.current.complete();
        setStatus(false);
        if (!query.get("next")) {
          setTimeout(() => history.replace("/login"), 1000);
        } else {
          setTimeout(
            () => history.replace(`/login?next=${query.get("next")}`),
            1000
          );
        }
      })
      .catch((error) => {
        setFormError(error.message);
        setStatus(false);
        loadingBar.current.complete();
        setSuccess(false);
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorPassword(true);
    } else {
      setStatus(true);
      loadingBar.current.continuousStart();
      resetPassword(password);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setErrorEmail(true);
    } else {
      setStatus(true);
      loadingBar.current.continuousStart();
      sendResetLink(email);
    }
  };

  return (
    <div className="passwordReset">
      {query.get("mode") === "resetPassword" ? (
        <form className="form" onSubmit={(e) => handleReset(e)}>
          <h4>Enter New Password</h4>
          {formError && (
            <motion.p
              initial="initial"
              animate="in"
              exit="out"
              variants={errorAnim}
              class={`form__error error ${success ? "green" : ""}`}
            >
              {formError}
            </motion.p>
          )}
          <div className="form__element">
            <input
              className={`${password ? "active " : ""} ${
                errorPassword ? "error " : ""
              }`}
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setErrorPassword(false)}
            />
            <label for="password">New Password</label>
            {errorPassword && (
              <motion.p
                initial="initial"
                animate="in"
                exit="out"
                variants={errorAnim}
                className="error"
              >
                Password must be atleast 8 characters long
              </motion.p>
            )}
            {passwordVisible ? (
              <VisibilityOutlinedIcon
                className="form__icon active"
                onClick={() =>
                  setPasswordVisible((passwordVisible) => !passwordVisible)
                }
              />
            ) : (
              <VisibilityOffOutlinedIcon
                className="form__icon"
                onClick={() =>
                  setPasswordVisible((passwordVisible) => !passwordVisible)
                }
              />
            )}
          </div>
          <div className="form__element buttons">
            <button
              disabled={status}
              className="button buttonPrimary submit"
              type="submit"
            >
              {status ? "Verifying..." : "Reset Password"}
            </button>
          </div>
          <hr />
          <Link to="/login">
            <div className="form__element buttons">
              <button className="button buttonSecondary signup">Log In</button>
            </div>
          </Link>
        </form>
      ) : (
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <h4>Recover your Password</h4>
          {formError && (
            <motion.p
              initial="initial"
              animate="in"
              exit="out"
              variants={errorAnim}
              class={`form__error error ${success ? "green" : ""}`}
            >
              {formError}
            </motion.p>
          )}
          <div className="form__element">
            <input
              className={`${email ? "active " : ""} ${
                errorEmail ? "error " : ""
              }`}
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErrorEmail(false)}
            />
            <label for="email">Email Address</label>
            {errorEmail && (
              <motion.p
                initial="initial"
                animate="in"
                exit="out"
                variants={errorAnim}
                className="error"
              >
                Please check your email address
              </motion.p>
            )}
          </div>
          <div className="form__element buttons">
            <button
              disabled={status}
              className="button buttonPrimary submit"
              type="submit"
            >
              {status ? "Verifying..." : "Reset Password"}
            </button>
          </div>
          <hr />
          <Link to="/login">
            <div className="form__element buttons">
              <button className="button buttonSecondary signup">Log In</button>
            </div>
          </Link>
        </form>
      )}
    </div>
  );
}
export default PasswordReset;

import React, { useState } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { auth, provider } from "../firebase";
import { motion } from "framer-motion";
import { useQuery, errorAnim } from "../util";
import { useStateValue } from "../StateProvider";

function Signup() {
  const [{ loadingBar }] = useStateValue();
  const query = useQuery();
  const history = useHistory();
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState(false);
  const [success, setSuccess] = useState(false);

  const googleSignIn = (e) => {
    e.preventDefault();
    setStatus(true);
    loadingBar.current.continuousStart();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setTimeout(() => {
          if (!query.get("next")) {
            history.replace("/");
          } else {
            history.replace(`/${query.get("next")}`);
          }
        }, 1000);

        console.log(result);
        setSuccess(true);
        setFormError("You are signed in!");
        setStatus(false);
        loadingBar.current.complete();
      })
      .catch((error) => {
        setFormError(error.message);
        setStatus(false);
        loadingBar.current.complete();
      });
  };

  const validateEmail = (value) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };

  const signUp = async (name, email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        auth.currentUser.sendEmailVerification().then(() => {
          auth.currentUser
            .updateProfile({
              displayName: name,
              photoURL: `https://i.pravatar.cc/150?u=${email}`,
            })
            .then(() => {
              setSuccess(true);
              loadingBar.current.complete();
              setFormError(
                "Verify your email to complete registration. Check your inbox/spam for verification email."
              );
              setStatus(false);
              setTimeout(() => {
                if (!query.get("next")) {
                  history.replace("/welcome");
                } else {
                  history.replace(`/welcome?next=${query.get("next")}`);
                }
              }, 3000);
            })
            .catch((error) => console.log(error.message));
        });
      })
      .catch((error) => {
        setFormError(error.message);
        loadingBar.current.complete();
        setStatus(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setErrorName(true);
    } else if (!email || !validateEmail(email)) {
      setErrorEmail(true);
    } else if (password.length < 8) {
      setErrorPassword(true);
    } else {
      setStatus(true);
      loadingBar.current.continuousStart();
      signUp(name, email, password);
    }
  };

  return (
    <div className="signup">
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <h4>Create your Account</h4>
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
        {success && <p style={{ margin: "1rem 0" }}>Redirecting...</p>}
        {!success && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={errorAnim}
          >
            <div className="form__element">
              <input
                className={`${name ? "active " : ""} ${
                  errorName ? "error " : ""
                }`}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setErrorName(false)}
              />
              <label for="name">Name</label>
              {errorName && (
                <motion.p
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={errorAnim}
                  className="error"
                >
                  You don't wanna be called Anonymous
                </motion.p>
              )}
            </div>
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
              <label for="password">Password</label>
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
                {status ? "Creating your account..." : "Sign Up"}
              </button>
            </div>
            <hr />
            <span className="form__resetLink">Already have an account?</span>
            <div className="form__element buttons">
              <button
                onClick={() =>
                  history.replace(
                    query.get("next")
                      ? `/login?next=${query.get("next")}`
                      : "/login"
                  )
                }
                disabled={status}
                className="button buttonSecondary signup"
              >
                Login In, instead
              </button>
              <button
                onClick={googleSignIn}
                disabled={status}
                className="button buttonSecondary outline"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
export default Signup;

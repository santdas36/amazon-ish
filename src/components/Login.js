import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { auth, provider } from "../firebase";
import { motion } from "framer-motion";
import { useQuery, errorAnim } from "../util";
import { useStateValue } from "../StateProvider";

function Login() {
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
        setFormError("Success! Redirecting...");
        setStatus(false);
        loadingBar.current.complete();
      })
      .catch((error) => {
        setFormError(error.message);
        setStatus(false);
        loadingBar.current.complete();
      });
  };

  useEffect(() => {
    const code = query.get("oobCode");
    const verifyCode = async (actionCode) => {
      auth
        .applyActionCode(actionCode)
        .then((res) => {
          console.log(res);
          setSuccess(true);
          setFormError(
            "Your email is verified successfully. Login again to complete the verification process."
          );
          if (auth.currentUser) {
            setTimeout(() => history.replace("/"), 3000);
          }
        })
        .catch((err) => {
          err.code === "auth/invalid-action-code"
            ? setFormError("Link Expired. Login to resend Verification Email.")
            : setFormError("Invalid link. Check again.");
        });
    };
    if (code) {
      verifyCode(code);
    }
  }, []);

  const validateEmail = (value) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };

  const signIn = async (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        if (!response.user.emailVerified) {
          auth.currentUser
            .sendEmailVerification()
            .then(() => {
              auth.signOut();
              setSuccess(false);
              loadingBar.current.complete();
              setFormError(
                "Email is not verified. We have sent the verification link again. Please check your inbox/spam."
              );
            })
            .catch((err) => console.log(err));
        } else {
          setSuccess(true);
          setFormError("Success! Redirecting...");
          setEmail("");
          setPassword("");
          setTimeout(() => {
            if (!query.get("next")) {
              history.replace("/");
            } else {
              history.replace(`/${query.get("next")}`);
            }
          }, 1000);
        }
        console.log(response);
        setStatus(false);
      })
      .then(() => loadingBar.current.complete())
      .catch((error) => {
        setFormError(error.message);
        loadingBar.current.complete();
        setStatus(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setErrorEmail(true);
    } else if (password.length < 8) {
      setErrorPassword(true);
    } else {
      setStatus(true);
      loadingBar.current.continuousStart();
      signIn(email, password);
    }
  };

  return (
    <div className="login">
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <h4>Log In</h4>
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
              Password is Required{" "}
              <Link to="/password-reset">
                <strong>Need Help?</strong>
              </Link>
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
            {status ? "Logging In..." : "Log In"}
          </button>
        </div>
        <Link
          to={
            query.get("next")
              ? `/password-reset?next=${query.get("next")}`
              : "/password-reset"
          }
        >
          <span className="form__resetLink">Need help logging in?</span>
        </Link>
        <hr />
        <div className="form__element buttons">
          <button
            disabled={status}
            onClick={() =>
              history.replace(
                query.get("next")
                  ? `/signup?next=${query.get("next")}`
                  : "/signup"
              )
            }
            className="button buttonSecondary signup"
          >
            Sign Up
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
      </form>
    </div>
  );
}
export default Login;

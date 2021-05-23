import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import "./Welcome.css";
import { useHistory, useLocation } from "react-router-dom";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import { useQuery, countries } from "../util";

function Welcome() {
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const checkbox = useRef(null);
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [{ user, loadingBar }] = useStateValue();

  const validateNumber = (value) => {
    const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return re.test(value);
  };

  const updateProfile = async () => {
    setLoading(true);
    db.collection("users")
      .doc(user.uid)
      .set(
        {
          name: user.displayName,
          email: user.email,
          phone: phone,
          dob: dob,
          address: address,
          state: stateName,
          country: country,
          postal_code: zipcode,
        },
        { merge: true }
      )
      .then(() => {
        setLoading(false);
        loadingBar.current.complete();
        const nextUrl = query.get("next");
        if (!nextUrl) {
          history.replace("/");
        } else if (nextUrl === "payment") {
          history.replace("/payment?from=signup");
        } else {
          history.replace(`/${nextUrl}`);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (country && validateNumber(phone) && checked) {
      setStatus(true);
      loadingBar.current.continuousStart();
      updateProfile();
    } else {
      alert("Please check your details again!");
    }
  };

  return (
    <div className="welcome">
      <div className="welcome__header">
        <img className="welcome__avatar" src={user?.photoURL} />
        <span>
          <h3>
            {location.state?.update ? <>Before you continue</> : <>Welcome</>},{" "}
            {user?.displayName}
          </h3>
          <p style={{ maxWidth: "480px", marginBottom: "2rem", opacity: 0.5 }}>
            {location.state?.update ? (
              <>
                We need you to update some of your shipping and contact details.
                These details will be saved for future orders.
              </>
            ) : (
              <>
                Your Amazon Account is created and we would like to know a
                little bit more about yourself. You may still want to confirm
                your email address to login next time.
              </>
            )}
          </p>
        </span>
      </div>
      <div className="welcome__inner">
        <form className="form__split" onSubmit={(e) => handleSubmit(e)}>
          <div className="form">
            <h5>Delivery Address</h5>
            <div className="form__element">
              <input
                className={address ? "active " : ""}
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <label for="address">Address</label>
            </div>
            <div className="form__element">
              <input
                className={stateName ? "active " : ""}
                id="state"
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                required
              />
              <label for="state">State</label>
            </div>
            <div className="form__element">
              <select
                className={country ? "active " : ""}
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option default selected value=""></option>
                {countries.map((item) => (
                  <option value={item.abbreviation}>{item.country}</option>
                ))}
              </select>
              <label for="country">Country</label>
            </div>
            <div className="form__element">
              <input
                className={zipcode ? "active " : ""}
                id="zip"
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                required
              />
              <label for="zip">ZIP Code</label>
            </div>
          </div>
          <div className="form">
            <h5>Personal Details</h5>
            <div className="form__element">
              <input
                className={dob ? "active " : ""}
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <label for="dob">Date of Birth</label>
            </div>
            <div className="form__element">
              <input
                className={phone ? "active " : ""}
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label for="phone">Mobile Number</label>
            </div>
            <div className="form__element">
              <input
                id="terms"
                type="checkbox"
                ref={checkbox}
                checked={checked}
                required
              />
              <label
                onClick={() => setChecked((checked) => !checked)}
                for="terms"
              >
                Accept Terms & Conditions
              </label>
            </div>
            <div className="form__element buttons">
              <button
                disabled={!checked || loading}
                style={{ margin: "none" }}
                className="button buttonPrimary submit"
                type="submit"
              >
                {status ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Welcome;

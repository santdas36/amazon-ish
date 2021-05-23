import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useHistory } from "react-router-dom";
import db, { auth } from "../firebase";
import { useStateValue } from "../StateProvider";

function Profile() {
  const history = useHistory();
  const [{ user, loadingBar }] = useStateValue();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (loadingBar) {
      loadingBar.current.continuousStart();
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((response) => {
            if (response.exists) {
              setUserDetails(response.data());
            } else {
              history.replace("/welcome?next=profile", { update: true });
            }
            if (loadingBar) {
              loadingBar.current.complete();
            }
          });
        unsubscribe();
      } else {
        history.replace("/login?next=profile");
        if (loadingBar) {
          loadingBar.current.complete();
        }
      }
    });
  }, []);

  const signOut = () => {
    loadingBar.current.continuousStart();
    auth.signOut().then(() => {
      setUserDetails(null);
      setTimeout(() => {
        loadingBar.current.complete();
        history.push("/");
      }, 1000);
    });
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <img className="profile__avatar" src={user?.photoURL} />
        <span>
          <h3>Hi, {user?.displayName}</h3>
          <p style={{ maxWidth: "480px", marginBottom: "2rem", opacity: 0.5 }}>
            This is your profile page. Here, you can view and customize your
            profile details. Double check your details before check out.
          </p>
        </span>
        <div className="buttons" style={{ marginLeft: "auto" }}>
          <button
            className="buttonRed"
            onClick={signOut}
            style={{ padding: "1rem 1.5rem" }}
          >
            Sign Out
          </button>
        </div>
      </div>
      {userDetails && (
        <div className="profile__inner">
          <p style={{ marginBottom: "1rem" }}>
            <span>Name</span>
            <span>{userDetails.name}</span>
          </p>
          <p>
            <span>Email Address</span>
            <span>{userDetails.email}</span>
          </p>
          <p style={{ marginBottom: "1rem" }}>
            <span>Phone</span>
            <span>{userDetails.phone}</span>
          </p>
          <p style={{ marginBottom: "1rem" }}>
            <span>Date of Birth</span>
            <span>{userDetails.dob}</span>
          </p>
          <p>
            <span>Address</span>
            <span
              style={{ maxWidth: "400px" }}
            >{`${userDetails.address}, ${userDetails.state}`}</span>
          </p>
          <p>
            <span>Country</span>
            <span>{userDetails.country}</span>
          </p>
          <p>
            <span>Zip Code</span>
            <span>{userDetails.postal_code}</span>
          </p>
        </div>
      )}
    </div>
  );
}
export default Profile;

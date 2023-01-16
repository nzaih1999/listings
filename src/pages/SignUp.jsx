import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibiltyIcon from "../assets/svg/visibilityIcon.svg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = (await userCredential).user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDatCopy = { ...formData };
      delete formDatCopy.password;
      formDatCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDatCopy);
      navigate("/");
    } catch (error) {
      toast("Something went wrong");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome</p>
        </header>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text "
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email "
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              name=""
              className="passwordInput"
              id="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibiltyIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot password?
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign Up</p>
            <button className="signInButton">
              <ArrowRightIcon fill="white" width="34px" height="34px" />
            </button>
          </div>
        </form>
        {/* Googlr OAuth */}
        <Link to="/sign-in" className="registerLink">
          Sign In instead
        </Link>
      </div>
    </>
  );
};

export default SignUp;

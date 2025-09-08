import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import {useAuth} from '../contexts/AuthContext.js';
import { useConfig } from '../contexts/ConfigContext';
import {useApi} from "../contexts/ApiContext";


export default function Login() {
  const { login } = useAuth(); // Access login function cdfrom context
  const { LogoName } = useConfig();
  const { Api: { BaseUrl, Endpoints } } = useConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const {postRequest} = useApi();
  const navigate = useNavigate(); // React Router navigation hook

  const handleLoginClick = async (e) => {
    if(checkIfLoginInputValid()){
        const requestApiUrl = `${BaseUrl}${Endpoints.Login}`;
        const body =  JSON.stringify({ email, password });
        try {
          const response = await postRequest(requestApiUrl, body, {
            headers: { 'Content-Type': 'application/json' }
          });
          handleAPIResponse(response);
          console.log("API response:", response);
        } catch (err) {
          console.error("API error:", err.response?.data || err.message);
        }
    }
  }

  const handleAPIResponse = (response) => {
    const res = response.data;
    console.log(res);
    switch(res.status){
      case 'success':
          login(res.message); 
          navigate('/dashboard');
        break;
        case 'error':
          setError(res.message);
          break;
        default:
          console.error("Unexpected response status:", res.status);
          break;
    }
  }

  const checkIfLoginInputValid = () => {
    setError("");
    let ret = false;
    if(email === ""){
        setError("EmailID is required.");

        document.getElementById("email").focus();
    } 
    else if(password === ""){
        setError("password is required.");
        document.getElementById("password").focus();
    } else {
        ret = true;
    }
    return ret;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{LogoName}</h2>
        <p>Sign in to your account</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="button" onClick={handleLoginClick}>Login</button>
        </form>
        <div className="login-links">
          <a href="#">Forgot Password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

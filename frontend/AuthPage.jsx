import React, {useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './src/App';
import { useNavigate } from 'react-router-dom';
import './src/App.css'



const AuthPage=()=>{
  const [email,setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [isRegistering, setisRegistering]=useState(false);
  const {setIsAuthenticated} = useContext(AuthContext);

  const navigate=useNavigate();



  const handleLogin=(e)=>{
    e.preventDefault();
  
    axios.post("http://localhost:5000/login", {email,password})
    .then((response)=>{
       setIsAuthenticated(true);
       navigate('/watchlist');
       
    })
    .catch((error)=>{
      alert("Invalid email or password");
    });
  };
  
  const handleRegister=(e)=>{
    e.preventDefault();
  
    axios.post("http://localhost:5000/register", {email,password})
    .then((response)=>{
      alert("User registered successfully");
      setisRegistering(false);
    })
    .catch((error)=>{
      alert(error.response.data.message || "Registration Failed");
    });
  
  };


return(
        <div className='login-page'>
          <h2>{isRegistering?"Register" : "Login"}</h2>
          <form onSubmit={isRegistering?handleRegister:handleLogin}>
            <input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             required
             />

             <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              />

              <button type="submit">{isRegistering?"Register" : "Login"}</button>
          </form>

          <button onClick={()=> setisRegistering(!isRegistering)}>
            {isRegistering?"Already have an account? Login" : "Dont have an account? Register"}
          </button>
          </div>
      
);
};

export default AuthPage;
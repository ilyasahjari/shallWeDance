import React, { useState } from 'react'
import {login} from '../services/auth.service'
import '../../css/login.css'
import '../../css/profil.css'

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = async(e) =>{
        e.preventDefault();
        setLoading(true);
        try{
            await login(email,password)
            setLoading(false);
            props.history.push('/allEvents');
        }catch(err){
            setErrorMessage(err);
            setLoading(false)
        }
    }


    return (
		<div className="login-content">
            	
			<form className="formLogin" onSubmit={handleLogin}>
				{/* <img src="img/avatar.svg"/> */}
				<h2 className="title">Bienvenue à ShallWeDance</h2>
           		<div className="input-div one">
           		   <div className="i">
           		   		<i className="fas fa-user"></i>
           		   </div>
           		   <div className="div">
           		   		<h5>Email</h5>
           		   		<input type="text" className="input" onChange={onChangeEmail}/>
           		   </div>
           		</div>
           		<div className="input-div pass">
           		   <div className="i"> 
           		    	<i className="fas fa-lock"></i>
           		   </div>
           		   <div className="div">
           		    	<h5>Mot de Passe</h5>
           		    	<input type="password" className="input" onChange={onChangePassword}/>
            	   </div>
            	</div>
                <a href="/register">Créé nouveau compte</a>
            	<a href="">Mot de passe oublié ?</a>
            	<input type="submit" className="loginButton" value="Login"/>
            </form>
        </div>

      
    )
}


export default Login;

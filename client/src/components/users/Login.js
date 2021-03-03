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
            props.history.push('/');
            window.location.reload()
        }catch(err){
            setErrorMessage(err);
            setLoading(false)
        }
    }


    return (
        <div class="row h-100 justify-content-center align-items-center">
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
                <div className="row">
                    <div className="col-md-12 row">
                        <div className="col-md-5 offset-md-1">
                        <a href="/register">Créé nouveau compte</a>
                        </div>
                        <div className="col-md-5">
                        <a href="">Mot de passe oublié ?</a>
                        </div>
                    </div>
                    <div className="col-md-12">
            	        <input type="submit" className="btn btn-primary" value="Login"/>
                    </div>
                </div>
            </form>
        </div>
        </div>
      
    )
}


export default Login;

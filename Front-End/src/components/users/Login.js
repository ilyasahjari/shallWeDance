import React, { useState } from 'react'
import {login} from '../services/auth.service'


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
            window.location.reload();
        }catch(err){
            setErrorMessage(err);
            setLoading(false)
        }
    }


    return (
        <div>
            email:
            <input type="email" onChange={onChangeEmail} /><br />
          password:
            <input type="password" onChange={onChangePassword} /><br />
            <button onClick={handleLogin} >Login</button>
        </div>
    )
}


export default Login;

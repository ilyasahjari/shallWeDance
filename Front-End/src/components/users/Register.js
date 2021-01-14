import React, {useState} from 'react'
import { register } from '../services/auth.service'


const Register = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onNameChange = (e) => {
        const name = e.target.value;
        setName(name)
    }

    const onEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email)
    }

    const onPasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleAdd = async (e) => {
        e.preventDefault();
        try{
        const user = await register({ name, email, password })
        props.history.push('/login')
        }catch(e){

        }
    }

    return (
        <div>
            <h1> Créer un compte </h1>

            <form onSubmit={handleAdd} >
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input className="form-control" type="text" id="name" name="name" autofocus onChange={onNameChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="place"> Email </label>
                    <input className="form-control" type="email" id="place" name="place" onChange={onEmailChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="city"> Password </label>
                    <input type="password" id="city" name="city" className="form-control" onChange={onPasswordChange} required />
                </div>

                <input type="submit" value="Envoyer" />
            </form>
        </div>
    )
}


export default Register;
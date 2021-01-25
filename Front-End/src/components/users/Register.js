import React, { useState } from 'react'
import { register } from '../services/auth.service'
import axios from "axios"
import moment from "moment"

const Register = (props) => {


    const API_URL = "http://localhost:3001/api/user/";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [date, setDate]= useState(moment().format("DD-MM-YYYY hh:mm:ss"))

    const formData = new FormData()

    const onFirstNameChange = (e) => {
        const firstName = e.target.value;
        setFirstName(firstName)
    }

    const onLastNameChange = (e) => {
        const lastName = e.target.value;
        setLastName(lastName)
    }

    const onEmailChange = (e) => {
        const email = e.target.value;
        setEmail(email)
    }

    const onPasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const onDateChange =(e)=>{
        const date = e.target.value;
        setDate(date)
    }

    const onChangeImage = (e) => {
        const image = e.target.files[0];
        formData.append('image', image)
    }

    

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('bornDate',date)
            await axios.post(API_URL + 'register', formData);

            props.history.push('/login')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <h1> Créer un compte </h1>

            <form onSubmit={handleAdd} >
                <div className="form-group">
                    <label htmlFor="name">Prenom</label>
                    <input className="form-control" type="text" id="name" name="name" autoFocus onChange={onFirstNameChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input className="form-control" type="text" id="name" name="name" onChange={onLastNameChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="place"> Email </label>
                    <input className="form-control" type="email" id="place" name="place" onChange={onEmailChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="city"> Password </label>
                    <input type="password" id="city" name="city" className="form-control" onChange={onPasswordChange} required />
                </div>

                <div className="col">
                    <label htmlFor="date"> Date </label>
                    <input type="date" id="date" name="date" className="form-control" onChange={onDateChange} value={moment(date).format("YYYY-MM-DD")} required />
                </div>

                <div className="form-group">
                    <label htmlFor="image"> Image </label>
                    <input type="file" id="image" name="image" className="form-control" onChange={onChangeImage} />
                </div>

                

                <input type="submit" value="Envoyer" />
            </form>
        </div>
    )
}


export default Register;
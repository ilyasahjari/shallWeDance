import axios from 'axios'
import '../../css/editProfile.css'
import authHeader from '../services/auth-header';
import { useState, useEffect } from 'react'
import bcrypt from 'bcryptjs'
import {logout} from '../services/auth.service'

const EditProfil = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_USER

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        country: '',
        style: '',
        image:''
    })

    const [image, setImage] = useState({name: ""})
    const [passwordVerif, setPasswordVerif] = useState('')
    const [password, setPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')

    const formData = new FormData()

    const handleLogout = async (e) => {
        try {
            await logout()
            window.location.href = "login"
        } catch (e) {
            console.log(e);
        }
    }

    const getProfile = async () => {
        try {
            const userData = await axios.get(API_URL + "me", { headers: authHeader() });
            setUser(userData.data)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])


    const onChangeUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const onChangePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onChangePasswordVerif = (e) => {
        setPasswordVerif(e.target.value)
    }

    const onChangeOldPassword = (e) => {
        setOldPassword(e.target.value)
    }

    const onChangeImage = (e) => {
        //formData.append('image', e.target.files[0])
        setImage(e.target.files[0])
        console.log(e.target.files[0])
    }

    const handleUserUpdate = async (e) => {
        e.preventDefault()
        try {
            const isMatch = await bcrypt.compare(oldPassword, user.password)
            formData.append("firstName",user.firstName)
            formData.append("lastName",user.lastName)
            formData.append("country",user.country)
            formData.append("style",user.style)
            if(image.name)
                formData.append('image', image)

            if (password && (password !== passwordVerif || !isMatch))
                    alert('Not Matching Password')
            else {
                if (password){
                    //user.password = password
                    formData.append("password",password)
                    await axios.post(API_URL + 'update/me', formData, { headers: authHeader() })
                    handleLogout();
                }else{
                    await axios.post(API_URL + 'update/me', formData, { headers: authHeader() })                    
                    props.history.push('/profile')
                }
            }
        } catch (e) {
            console.log(e)
        } 
    }

    return (
        <div className="container bootstrap snippet">
            <div className="row">
            </div>
            <div className="row">
                <div className="col-sm-3">


                    <div className="text-center">
                        <img src={process.env.PUBLIC_URL + '/images/' + user.image} className="img-circle img-thumbnail" alt="avatar" />
                        <input type="file" className="text-center center-block" onChange={onChangeImage} />
                    </div><hr /><br />


                    <ul className="list-group">
                        <li className="list-group-item text-muted">Activity <i className="fa fa-dashboard fa-1x"></i></li>
                        <li className="list-group-item text-right"><span className="pull-left"><strong>Posts</strong></span> 37</li>
                        <li className="list-group-item text-right"><span className="pull-left"><strong>Abonnés</strong></span> 78</li>
                    </ul>



                </div>
                <div className="col-sm-9">
                    <div className="tab-content">
                        <div className="tab-pane active" id="home">
                            <hr />
                            <form className="form" onSubmit={handleUserUpdate} >
                                <div className="form-group">

                                    <div className="col-xs-6">
                                        <label><h4>Prénom</h4></label>
                                        <input type="text" className="form-control" value={user.firstName} onChange={onChangeUser} name="firstName" id="firstName" placeholder="first name" title="enter your first name if any." />
                                    </div>
                                </div>
                                <div className="form-group">

                                    <div className="col-xs-6">
                                        <label ><h4>Nom</h4></label>
                                        <input type="text" className="form-control" value={user.lastName} onChange={onChangeUser} name="lastName" id="lastName" placeholder="last name" title="enter your last name if any." />
                                    </div>
                                </div>

                                <div className="form-group">

                                    <div className="col-xs-6">
                                        <label><h4>Style</h4></label>
                                        <input type="text" className="form-control" value={user.style} onChange={onChangeUser} name="style" id="last_name" placeholder="style" title="enter your style" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-6">
                                        <label><h4>Location</h4></label>
                                        <input type="text" className="form-control" value={user.country} onChange={onChangeUser} name="country" id="location" placeholder="somewhere" title="enter a location" />
                                    </div>
                                </div>


                                <div className="form-group">
                                    <div className="col-xs-6">
                                        <label><h4>Ancien Mot de passe</h4></label>
                                        <input type="password" className="form-control" name="oldPassword" id="password" onChange={onChangeOldPassword} placeholder="old password" title="enter your password." />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="col-xs-6">
                                        <label><h4>Nouveau Mot de passe</h4></label>
                                        <input type="password" className="form-control" name="password" id="password" onChange={onChangePassword} placeholder="new password" title="enter your password." />
                                    </div>
                                </div>
                                <div className="form-group">

                                    <div className="col-xs-6">
                                        <label><h4>Verifier Mot de Passe </h4></label>
                                        <input type="password" className="form-control" name="passwordVerif" id="passwordVerif" onChange={onChangePasswordVerif} placeholder="password verification" title="enter your password2." />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-xs-12">
                                        <br />
                                        <button className="btn btn-success" type="submit"> Save</button>
                                    </div>
                                </div>
                            </form>

                            <hr />

                        </div>

                    </div>
                </div>
            </div>
        </div>


    )
}

export default EditProfil;

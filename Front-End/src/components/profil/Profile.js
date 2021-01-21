import React, { useEffect, useState } from 'react'
import PostItem from "./Post.js"
import axios from 'axios'
import authHeader from '../services/auth-header';
import { Link } from 'react-router-dom';
import '../../css/profil.css'



const Profile = () => {

  const API_URL = "http://localhost:3001/api/user/";

  const [user, setUser] = useState({
    firstName: '',
    lastName:'',
    email: '',
    bornDate: new Date(),
    gendre: 'F',
    bio: '',
    country: '',
    style:'',
    image: ''
  })

  const getAge=(dateString)=> {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }
    
  const getUser = async () => {
    try {
      const user = await axios.get(API_URL + 'me', { headers: authHeader() })
      setUser(user.data);
      console.log(user.data);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div>
      <div className="ProfilHeader">

        <div>
          <img className="ProfilPicture" src={process.env.PUBLIC_URL + '/images/' + user.image}/>
          
        </div>
        
        <div>
        <br/>
          <h3> {user.firstName.toUpperCase()}  {user.lastName.toUpperCase()}</h3>
        </div>

        <div>
          <div className="ProfilAction">
            <h6><b>50 </b>Posts</h6>
            <h6><b>50 </b>friends</h6>
            <h6><b>50 </b>Events</h6>
          </div>
          <div className="ProfilAction">
            <h6>
              <a className="btn btn-primary w-100 topButton" href={'/createdEvents'} > Mes événement créé </a>
            </h6>
            <h6><a className="btn btn-primary w-100 topButton"  > Mes groupes </a></h6>
          </div>
        </div>
        
      </div>

      <div className="ProfilContent">
      <br/>
        <div className="ProfilInfo">
          <h6>Age : {  getAge(user.bornDate)} ans</h6>
          <h6>Country : {user.country}</h6>
          <h6>Style : {user.style}</h6>
        </div>
        <div className="ProfilPosts">
          <PostItem />
        </div>
      </div>
    </div>
  );
}

export default Profile;

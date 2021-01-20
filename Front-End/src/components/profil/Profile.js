import React, { useEffect, useState } from 'react'
import Header from './Header'
import PostItem from "./Post.js"
import axios from 'axios'
import authHeader from '../services/auth-header';
import { Link } from 'react-router-dom';

const Profile = () => {

  const API_URL = "http://localhost:3001/api/user/";

  const [user, setUser] = useState({
    name: '',
    email:'',
    bornDate: new Date(),
    gendre:'F',
    bio:'',
    country:'',
    image:''
  })

  useEffect(async () => {
    try {
      const user = await axios.get(API_URL + 'me', { headers: authHeader() })
      setUser(user.data);
      console.log(user.data);
    } catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <div>
      <Header />
      <div className="ProfilHeader">

        <div>
          <img className="ProfilPicture"
          />
        </div>

        <div>
          <h3> {user.name}</h3>
        </div>

        <div>
          <div className="ProfilAction">
            <h6><b>50 </b>Posts</h6>
            <h6><b>50 </b>friends</h6>
            <h6><b>50 </b>Events</h6>
          </div>
          <div className="ProfilAction">
            <h6>
              <Link to="/createdEvents">
                <button>My Events</button>
              </Link>
            </h6>
            <h6><button>My Groups</button></h6>
          </div>
        </div>

      </div>
      <div className="ProfilContent">
        <div className="ProfilInfo">
          <h6>Age : 23ans a calculer !</h6>
          <h6>Country : {user.country}</h6>
          <h6>Style : HipHop</h6>
        </div>
        <div className="ProfilPosts">
          <PostItem />
        </div>
      </div>
    </div>
  );
}

export default Profile;

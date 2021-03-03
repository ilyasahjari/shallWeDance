import React, { useEffect, useState } from 'react'
import PostItem from "./Post.js"
import axios from 'axios'
import moment from "moment";
import authHeader from '../services/auth-header';
import addImage from '../../images/addImage.png'
import addVideo from '../../images/addVideo.png'
import { Link } from 'react-router-dom';
import '../../css/profil.css'
import {diffDate,likePublication,unLikePublicaton,likeButton,AllPublications,getUser} from '../services/publication-service'



const Profile = (props) => {

  const API_URL = process.env.REACT_APP_API_URL_USER
  const API_URL_2 = process.env.REACT_APP_API_URL_PUBLICATION
  const API_URL_3 =  process.env.REACT_APP_API_URL_EVENT



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

  const formData = new FormData()

  const [errorMessage, setErrorMessage] = useState('')


  const [publication,setPublication] = useState ({
    content :'',
    video : ''
  })

  const [publicationImage , setPublicationImage] = useState({name:""})

  const [publications, setPublications] = useState([]);

  const [isOpened, setIsOpened] = useState(false);

  const [nbevent,setNbEvent] = useState({count:0})


  function toggle() {
    setIsOpened(wasOpened => !wasOpened);
  } 

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
 

  const onChangeEvent = (e) => {
    setPublication({ ...publication, [e.target.name]: e.target.value })
  }

  const onChangeImage = (e) => {
    setPublicationImage(e.target.files[0])
  }
 
  const addPublication = async (e) => {
    e.preventDefault();
    try {
      formData.append('content',publication.content);
      if(publicationImage.name)
        formData.append('image',publicationImage)
      await axios.post(API_URL_2 + 'addPublication', formData, { headers: authHeader() })
      const publidata = await axios.get(API_URL_2 + 'myPublications',{ headers: authHeader() })
      setPublications(publidata.data);
      setPublication([])
      toggle()
    } catch (e) {
      setErrorMessage(e);
      console.log(e);
    }
  }   
  
  const getPublications = async () => {
    try{
      const publications = await axios.get(API_URL_2 + 'myPublications', { headers : authHeader() });
      setPublications(publications.data);
    }catch (e) {
      console.log(e)
    }
  }

  
  const getUser = async () => {
    try {
      const user = await axios.get(API_URL + 'me', { headers: authHeader() })
      setUser(user.data);
    } catch (e) {
      console.log(e)
    }
  }

  const getNbEventUser = async () => {
    try{
        const count = await axios.get(API_URL_3+"countEventsUser/"+user._id,{ headers: authHeader() })
        setNbEvent(count.data)
    }catch (e) {
        console.log(e)
    }
}



  useEffect(() => {
    getUser();
    getPublications();
    getNbEventUser()
  }, [])


  const likePublication = async (_id) => {
    try {
        await axios.post(API_URL_2 + "addLike/" + _id, {}, { headers: authHeader() });
        //const publidata = await axios.get(API_URL_2 + 'myPublications',{ headers: authHeader() })
        getPublications()
    }
    catch (e) {
        console.log(e);
    }
}

const unLikePublicaton = async (_id) => {
    try {
        await axios.post(API_URL_2 + "removeLike/" + _id, {}, { headers: authHeader() });
        //const publidata = await axios.get(API_URL_2 + 'myPublications/',{ headers: authHeader() })
        getPublications()
    }
    catch (e) {
        console.log(e);
    }
}


  return (
      <div>
        <div className="ProfilHeader">

          <div>
            <img className="ProfilPicture" src={process.env.PUBLIC_URL + '/images/' + user.image}/>

          </div>

          <div>
            <br/>
            <h3> {user.firstName.toUpperCase()}  {user.lastName.toUpperCase()}</h3>
            <h6>Age : {  getAge(user.bornDate)} ans</h6>
            <h6>Country : {user.country}</h6>
            <h6>Style : {user.style}</h6>
          </div>

          <div>
            <div className="ProfilAction">
              <h6><b>{publications.length} </b>Posts</h6>
              <h6><b>{user.following ? user.following.length : 0 } </b>abonnement</h6>
              <h6><b> {nbevent.count} </b>Events</h6>
            </div>
            <div className="ProfilAction">
              <h6>
                <a className="btn btn-primary  topButton" href={'/createdEvents'} > Mes événements</a>
              </h6>
              <h6>
                <a className="btn btn-primary  topButton" href={'/editprofile'} > Modifier profil </a>
              </h6>
              <h6><a className="btn btn-primary  topButton"  href={'/groupes'}> Groupes </a></h6>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-md-3 offset-md-9">
            <button className="btn btn-success" onClick={toggle}> Écrire une publication </button>
          </div>

          {isOpened && (
              <div className="col-md-8 offset-md-2">
                <form onSubmit={addPublication}>

                  <div className="form-group">
                    <label htmlFor="content"> Que souhaitez-vous dire à vos amis ?</label>
                    <textarea className="form-control" type="text" id="content" name="content"  onChange={onChangeEvent} required />
                  </div>

                  <div className="form-row mt-2 image-upload">
                    <div className="col image-upload">
                      <label for="imageFile">
                        <img src={addImage} className="iconimage"/>
                      </label>
                      <input id="imageFile" type="file" onChange={onChangeImage} />
                    </div>

                    <div className="col image-upload">
                      <label for="videoFile">
                        <img src={addVideo} className="iconimage"/>
                      </label>
                      <input id="videoFileFile" type="file" />
                    </div>

                  </div>
                  <input type="submit" value="Ajouter ma publication" className="btn btn-primary" />
                </form>
              </div>
            )}
        </div>
        <div className="ProfilContent">
          <br/>
          <div className="ProfilPosts">
            <AllPublications publications={publications} user={user} likePublication={likePublication} unLikePublicaton={unLikePublicaton} />
          </div>
      </div>
    </div>
  );
}

export default Profile;

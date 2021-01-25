import React, { useEffect, useState } from 'react'
import PostItem from "./Post.js"
import axios from 'axios'
import moment from "moment";
import authHeader from '../services/auth-header';
import addImage from '../../images/addImage.png'
import addVideo from '../../images/addVideo.png'
import { Link } from 'react-router-dom';
import '../../css/profil.css'



const Profile = (props) => {

  const API_URL = "http://localhost:3001/api/user/";
  const API_URL_2 = "http://localhost:3001/api/publication/";


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

  var now = moment(new Date());
  const [publication,setPublication] = useState ({
    content :'',
    image : '',
    video : '',
    date: now
  })

  const [publications, setPublications] = useState([]);


  const [isOpened, setIsOpened] = useState(false);

  function toggle() {
    setIsOpened(wasOpened => !wasOpened);
  } 

  const onChangeEvent = (e) => {
    setPublication({ ...publication, [e.target.name]: e.target.value })
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
    
  const getUser = async () => {
    try {
      const user = await axios.get(API_URL + 'me', { headers: authHeader() })
      setUser(user.data);
      console.log(user.data);
    } catch (e) {
      console.log(e)
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

  useEffect(() => {
    getUser();
    getPublications();
  }, [])

  const addPublication = async (e) => {
    e.preventDefault();
    try {
      formData.append('content',publication.content);
      formData.append('date',publication.date);
      await axios.post(API_URL_2 + 'addPublication', formData, { headers: authHeader() })
      props.history.push('/profile')
      window.location.reload()
    } catch (e) {
      setErrorMessage(e);
      console.log(e);
    }

  }

  const [isCommentInput, setIsCommentInput] = useState(false)

  const handleCommentShow = () => {
      setIsCommentInput(!isCommentInput)
  }

  const onChangeImage = (e) => {
    formData.append('image',e.target.files[0])
  }

  const diffDate = (date) => {
    const minutes = Math.round(moment.duration(now.diff(date)).asMinutes());
    const hours = Math.round(moment.duration(now.diff(date)).asHours());
    const days = Math.round(moment.duration(now.diff(date)).asDays());
    if(minutes < 60 ){
      return "Il y a " + minutes + " minutes";
    }
    else if (hours < 24){
      return "Il y a "+ hours + " heures";
    }
    else{
      return "Il y a "+ days + " jours";
    }
  }

  function AllMyPublication(){
    return (
      <div className="row">
        {
          publications.map((publi) => {
            return(
              <div className="col-md-12">
                <div className="post">
                  <div className="post-header col-md-4">
                    <img className="avatar" src={process.env.PUBLIC_URL + '/images/' + user.image}/>
                    <div className="details">
                      <span className="mx-2"> {user.firstName} </span>
                      <span className="mx-2"> { diffDate(publi.date) } </span> 
                     
                    </div>
                  
                  </div>

                  <h1 className="post-content">{ publi.content} </h1>
                  {
                        publi.image ?  <img src={process.env.PUBLIC_URL + '/images/' + publi.image} className="imgPost mt-4"></img> : ""
                  }

                
                </div>
                <div className="row">
                  <div className="col-md-4">
                      <button className="btn btn-primary btn-block"> J'aime</button>
                  </div>
                  <div className="col-md-4">
                      <button className="btn btn-primary btn-block"> Commenter</button>
                  </div>
                  <div className="col-md-4">
                      <button className="btn btn-primary btn-block"> Partager</button>
                  </div>
                </div>
              </div>
            )
          }
          )
        }
      </div>
    );
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
          <AllMyPublication />
        </div>
      </div>
    </div>
  );
}

export default Profile;

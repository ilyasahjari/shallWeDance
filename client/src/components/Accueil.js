import { useState, useEffect } from 'react';
import { logout } from './services/auth.service'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import authHeader from './services/auth-header'
import { AllPublications } from './services/publication-service'
import addImage from './../images/addImage.png'
import addVideo from './../images/addVideo.png'


const Accueil = (props) => {

  const API_URL = process.env.REACT_APP_API_URL_USER
  const API_URL_2 = process.env.REACT_APP_API_URL_PUBLICATION

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bornDate: new Date(),
    gendre: 'F',
    bio: '',
    country: '',
    style: '',
    image: ''
  })

  const [feed, setFeed] = useState([])

  const [publication,setPublication] = useState ({
    content :'',
    video : ''
  })

  const [publicationImage , setPublicationImage] = useState({name:""})

  const [isOpened, setIsOpened] = useState(false);

  const formData = new FormData()

  const getUser = async () => {
    try {
      const user = await axios.get(API_URL + 'me', { headers: authHeader() })
      setUser(user.data);
    } catch (e) {
      console.log(e)
    }
  }

  const getFeedContent = async () => {
    try {
      const publications = await axios.get(API_URL_2 + 'feed', { headers: authHeader() });
      setFeed(publications.data);
    } catch (e) {
      console.log(e)
    }
  }

  const likePublication = async (_id) => {
    try {
      await axios.post(API_URL_2 + "addLike/" + _id, {}, { headers: authHeader() });
      getFeedContent()
    }
    catch (e) {
      console.log(e);
    }
  }

  const unLikePublicaton = async (_id) => {
    try {
      await axios.post(API_URL_2 + "removeLike/" + _id, {}, { headers: authHeader() });
      getFeedContent();
    }
    catch (e) {
      console.log(e);
    }
  }

  const addPublication = async (e) => {
    e.preventDefault();
    try {
      formData.append('content',publication.content);
      if(publicationImage.name)
        formData.append('image',publicationImage)
      await axios.post(API_URL_2 + 'addPublication', formData, { headers: authHeader() })
      const publidata = await axios.get(API_URL_2 + 'myPublications',{ headers: authHeader() })
      setFeed(publidata.data);
      toggle()
    } catch (e) {
      console.log(e);
    }
  }   

  const onChangeEvent = (e) => {
    setPublication({ ...publication, [e.target.name]: e.target.value })
  }

  const onChangeImage = (e) => {
    setPublicationImage(e.target.files[0])
  }

  function toggle() {
    setIsOpened(wasOpened => !wasOpened);
  } 



  useEffect(() => {
    getUser();
    getFeedContent();
  }, [])


  return (
    <div>
      <div className="row">
        <div className="col-md-3 offset-md-9">
          <button className="btn btn-success" onClick={toggle}> Écrire une publication </button>
        </div>

        {isOpened && (
          <div className="col-md-8 offset-md-2">
            <form onSubmit={addPublication}>

              <div className="form-group">
                <label htmlFor="content"> Que souhaitez-vous dire à vos amis ?</label>
                <textarea className="form-control" type="text" id="content" name="content" onChange={onChangeEvent} required />
              </div>

              <div className="form-row mt-2 image-upload">
                <div className="col image-upload">
                  <label for="imageFile">
                    <img src={addImage} className="iconimage" />
                  </label>
                  <input id="imageFile" type="file" onChange={onChangeImage} />
                </div>

                <div className="col image-upload">
                  <label for="videoFile">
                    <img src={addVideo} className="iconimage" />
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
        <br />
        <div className="ProfilPosts">
          {feed ?
            <AllPublications publications={feed} user={user} isContent={true} likePublication={likePublication} unLikePublicaton={unLikePublicaton} />
            :
            (<div>
              <h1>Encore aucune publication</h1>
              <h2>Commencer par vous abonnez à des danseurs !!</h2>
            </div>)
          }
        </div>
      </div>
    </div>
  );
}



export default Accueil;

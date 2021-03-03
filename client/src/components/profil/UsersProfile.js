import { useState, useEffect } from 'react'
import axios from 'axios'
import authHeader from '../services/auth-header';
import '../../css/profil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { getCurrentUser } from '../services/auth.service';
import {AllPublications} from '../services/publication-service'


const UsersProfile = (props) => {

    const API_URL =  process.env.REACT_APP_API_URL_USER
    const API_URL1 = process.env.REACT_APP_API_URL_PUBLICATION
    const API_URL2 =  process.env.REACT_APP_API_URL_EVENT

    const _id = props.match.params.userId


    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bornDate: new Date(),
        gendre: 'F',
        bio: '',
        country: '',
        style: '',
        image: '',
        following: []
    })

    const [followers, setFollowers] = useState([])

    const [publications, setPublications] = useState([]);

    const [nbevent,setNbEvent] = useState({count:0})


    const getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const getNbEventUser = async () => {
        try{
            const count = await axios.get(API_URL2+"countEventsUser/"+_id,{ headers: authHeader() })
            setNbEvent(count.data)
        }catch (e) {
            console.log(e)
        }
    }

    const getUser = async () => {
        try {
            const user = await axios.get(API_URL + _id, { headers: authHeader() })
            setUser(user.data);
        } catch (e) {
            console.log(e)
        }
    }

    const followUser = async () => {
        try {
            const user = await axios.post(API_URL + 'follow/' + _id, {}, { headers: authHeader() })
            setFollowers(user.data)   
        } catch (e) {
            console.log(e)
        }
    }


    const unfollowUser = async () => {
        try {
            const user = await axios.post(API_URL + 'unfollow/' + _id, {}, { headers: authHeader() })
            setFollowers(user.data)
        } catch (e) {
            console.log(e)
        }
    }

    

    const IsFollowing =(props)=>{
        if(props.followers.some((follower) => follower._id === getCurrentUser()._id)) 
            return <a className="btn btn-primary topButton" onClick={unfollowUser}><FontAwesomeIcon icon={faCheck} size="xs"/> Abonné</a> 
        else
           return (<a className="btn btn-primary topButton" onClick={followUser}>S'abonner</a>)
        
    }

    const getUserFollowers = async () => {
        try {
            const usersFollowers = await axios.get(API_URL + 'followers/' + _id, { headers: authHeader() })
            setFollowers(usersFollowers.data);
        } catch (e) {
            console.log(e)
        }
    }

    const getUserPublications = async()=>{
        try{
            const userPublications = await axios.get(API_URL1 + 'userPublications/'+ _id ,{ headers : authHeader() })
            setPublications(userPublications.data)
        }catch(e){
            console.log(e)
        }
    }


    useEffect(() => {
        getUser();
        getUserFollowers();
        getUserPublications();
        getNbEventUser();
    }, [])




    return (
        <div>
            <div className="ProfilHeader">

                <div>
                    <img className="ProfilPicture" src={process.env.PUBLIC_URL + '/images/' + user.image} />
                </div>

                <div>
                    <br />
                    <h3> {user.firstName.toUpperCase()}  {user.lastName.toUpperCase()}</h3>
                    <h6>Age : {getAge(user.bornDate)} ans</h6>
                    <h6>Country : {user.country}</h6>
                    <h6>Style : {user.style}</h6>
                </div>

                <div>
                    <div className="ProfilAction">
                        <h6><b>{publications.length} </b>Posts</h6>
                        <h6><b>{followers.length} </b>Abonnés</h6>
                        <h6><b>{nbevent.count}</b>Events</h6>
                    </div>
                    <div className="ProfilAction">
                        <h6>
                            <a className="btn btn-primary topButton" href={'/createdEvents'} > Mes événements</a>
                        </h6>
                    
                        <h6>
                            <IsFollowing followers={followers}/>
                        </h6>
                        <h6><a className="btn btn-primary topButton" href={'/groupes'}> Groupes </a></h6>
                    </div>
                </div>

            </div>

            {/* <div className="row">
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
            </div> */}
            <div className="ProfilContent">
                <br />
                <div className="ProfilPosts">
                     <AllPublications publications={publications} user={user}/>  
                </div>
            </div>

        </div>
    )
}

export default UsersProfile;
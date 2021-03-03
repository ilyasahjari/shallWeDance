import React, { useState, useEffect } from 'react';
import moment from "moment";
import axios from "axios"
import authHeader from '../services/auth-header';
import {getCurrentUser} from "../services/auth.service";
import addImage from '../../images/addImage.png'
import addVideo from '../../images/addVideo.png'
import {diffDate,likePublication,unLikePublicaton,likeButton,AllPublications,getUser} from '../services/publication-service'
import { Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMapMarkerAlt, faCalendarAlt, faAlignLeft} from '@fortawesome/free-solid-svg-icons'
import {ModalInviteEvent} from "../services/invite-service"
import RateCard from '../rates/RateCard';



const SeeEvent = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_EVENT
    const API_URL_2 = process.env.REACT_APP_API_URL_PUBLICATION
    const API_URL_3 = process.env.REACT_APP_API_URL_USER


    const [event, setEvent] = useState({
        name: '',
        _id: '',
        place: '',
        city: '',
        postcode: 0,
        description: '',
        hour: '',
        owner :'',
        participants : [],
        type : [],
        iscancel : '',
        cancelreason : '',
        date: 'moment().format("DD-MM-YYYY hh:mm:ss")'
    })

    const formData = new FormData()

    const [errorMessage, setErrorMessage] = useState('')


    var now = moment(new Date());
    
    const [publication,setPublication] = useState ({
        content :'',
        image : '',
        video : ''
    })

    const [publications, setPublications] = useState([]);


    const [isOpened, setIsOpened] = useState(false);

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

    const [owner, setOwner] = useState({
        firstName: '',
        image: ''
    })

    const [key, setKey] = useState('détails');

    function toggle() {
        setIsOpened(wasOpened => !wasOpened);
    } 

    const onChangeEvent = (e) => {
        setPublication({ ...publication, [e.target.name]: e.target.value })
    }

    const paticipateToEvent = async (_id) => {
        try {
            await axios.post(API_URL + "participate/" + _id, { } , { headers: authHeader() })
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    }

    const getUser = async () => {
        try {
          const user = await axios.get(API_URL_3 + 'me', { headers: authHeader() })
          setUser(user.data);
          console.log(user.data);
        } catch (e) {
          console.log(e)
        }
    }

   
    const getEventDetails = async()=>{
        try {
          const _id = props.match.params.eventId
          const eventData = await axios.get(API_URL + "getEventDetails/" + _id, { headers: authHeader() });
          setEvent(eventData.data)
        } catch (e) {
          console.log(e);
        }
    }

    const getEventPublications = async() => {
        try{
            const _id = props.match.params.eventId
            const publidata = await axios.get(API_URL_2 + "getEventPublications/" + _id,{ headers: authHeader() })
            setPublications(publidata.data);
        }catch (e) {
            console.log(e);
          }
    }

    useEffect( () => {
        getEventDetails();
        getEventPublications();
        getUser();
    }, [])



    const DisplayModifyButton = (props) => {
        if(getCurrentUser()._id === props.ownerId) {
            return ( <a className="btn btn-primary w-100 mb-5" href={'/updateEvent/' + props.eventId} > Modifier </a>)
        }
        return null;
    };

    const onChangeImage = (e) => {
        formData.append('image',e.target.files[0])
    }

    const addPublication = async (e) => {
        e.preventDefault();
        try {
          formData.append('content',publication.content);
          formData.append('event',event._id);
          await axios.post(API_URL_2 + 'addPublication', formData, { headers: authHeader() })
          const _id = props.match.params.eventId
          const publidata = await axios.get(API_URL_2 + "getEventPublications/" + _id,{ headers: authHeader() })
          setPublications(publidata.data);
          setPublication([])
          toggle()
        } catch (e) {
          setErrorMessage(e);
          console.log(e);
        }      
    }

    const likePublication = async (_id) => {
        try {
            await axios.post(API_URL_2 + "addLike/" + _id, {}, { headers: authHeader() });
            const publidata = await axios.get(API_URL_2 + "getEventPublications/" + _id,{ headers: authHeader() })
            getEventPublications()
        }
        catch (e) {
            console.log(e);
        }
    }

    const unLikePublicaton = async (_id) => {
        try {
            await axios.post(API_URL_2 + "removeLike/" + _id, {}, { headers: authHeader() });
            const publidata = await axios.get(API_URL_2 + "getEventPublications/" + _id,{ headers: authHeader() })
            getEventPublications()
        }
        catch (e) {
            console.log(e);
        }
    }

    const DetailsEvents = () => {
        return (
            <div key={"divglobal"+event._id}>
                <div className="text-left ml-3 background-dark">
                    <div className="ml-3">
                        <h4 className="mb-3"> Détails </h4>
                        <p> <FontAwesomeIcon icon={faCalendarAlt} size="lg" className="mr-2"/>{
                            event.hour?
                                moment(event.date).format("DD MMMM YYYY") + " à " + event.hour :
                                moment(event.date).format("DD MMMM YYYY")
                            }
                        </p>
                        <p> <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" className="mr-2"/> {event.place + ' - ' + event.city + ' - ' + event.postcode}</p>
                        <p> <FontAwesomeIcon icon={faAlignLeft} size="lg" className="mr-2"/> {event.description}</p>
                    </div>
                </div>
                <div className="text-left ml-3 background-dark">
                    <div className="ml-3">
                        <h4 className="mb-3"> Organisateur</h4>
                        <a href={'/profile/'+event.owner._id}> <img className="organisateur" href={'/profile/'+event.owner._id} src={process.env.PUBLIC_URL + '/images/' + event.owner.image}/> {event.owner.firstName} </a>
                        <p className="invisible"> aa</p>
                    </div>
                </div>

                <div className="text-left ml-3 background-dark">
                    <div className="ml-3">
                        <h4 className="mb-3"> Type de danse</h4>
                        <p> {event.type.name}</p>
                    </div>
                </div>
                {
                    event.iscancel?
                    <div className="text-left ml-3 bg-danger">
                        <div className="ml-3">
                            <h4 className="mb-3"> Annulation </h4>
                            <p> {event.cancelreason} </p>
                        </div>
                    </div>
                    :""
                }
            </div>
            
        )
    }

    
    return (
        <div key={"global"+event._id}>

            <div className="ProfilHeader">

                <div>
                    <img className="ProfilPicture" src={process.env.PUBLIC_URL + '/images/' + event.image}/>

                </div>

                <div>
                    <br/>
                    <h3> {event.name} </h3>
                </div>

                <div>
                    <div className="ProfilAction">
                        <h6><b>{event.participants.length} </b>Participants</h6>
                
                    </div> 
                        <div className="ProfilAction">
                        <h6>
                            <DisplayModifyButton eventId={event._id} ownerId={event.owner}/>
                        </h6>
                        <h6> <a className="btn btn-primary w-100" onClick={(e) => { paticipateToEvent(event._id) }}> Participer </a> </h6>
                        <ModalInviteEvent event={event}/>
                    </div>
                </div>
            </div>
            <Tabs 

            id="controlled-tab-example"

            className="nav nav-tabs nav-justified mb-5 bg-white"

            activeKey={key}

            onSelect={(k) => setKey(k)}>

                <Tab eventKey="détails" title="Détails" key={"detail"+event.id}>
                   <DetailsEvents/>
                </Tab>
                <Tab eventKey="discussions" title="Discussions" key={"comment"+event.id}>
                    <div className="row">
                        <div className="col-md-3 offset-md-9">
                            <button className="btn btn-success" onClick={toggle}> Écrire une publication </button>
                        </div>
                        {isOpened && (
                            <div className="col-md-8 offset-md-2">
                                <form onSubmit={addPublication}>
                                    <div className="form-group">
                                        <label htmlFor="content"> Que souhaitez-vous dire sur cet événement ?</label>
                                            <textarea className="form-control" type="text" id="content" name="content" value={publication.content} onChange={onChangeEvent} required />
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
                </Tab>
                <Tab eventKey="avis" title="Avis"  key={"avis"+event._id}>
                    <RateCard idEvent={props.match.params.eventId} className="margintest"/>
                </Tab>

            </Tabs>
            
    </div>
    );

}

export default SeeEvent;

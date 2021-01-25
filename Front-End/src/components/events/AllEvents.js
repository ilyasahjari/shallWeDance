import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/fr';
import authHeader from '../services/auth-header';
import Accueil from '../Accueil';


const AllEvents = () => {

    const [events, setEvents] = useState([]);
    const API_URL = "http://localhost:3001/api/event/";

    const paticipateToEvent = async (_id) => {
        try {
            await axios.post(API_URL + "participate/" + _id, { } , { headers: authHeader() })
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    }

    const getEvents = async () => {
        try {
            const events = await axios.get(API_URL + 'allEvents');
            setEvents(events.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getEvents();
    }, [])


    return (
        <div className="row">
            <div className="col-md-3 offset-md-9 mb-10">
                <a className="btn btn-primary w-100 topButton" href={'/addEvent'} > Créer un événement </a>
            </div>
            <div className="col-md-3 offset-md-9 mb-10">
                <a className="btn btn-primary w-100 topButton" href={'/createdEvents'} > Vos événement créé  </a>
            </div>
            { events.map((event) => {
                return (
                    <div className="col-md-12 border border-dark mb-3" key={event._id}>
                        <h2 className="text-center"><a className="redirect" href={'/seeEvent/' + event._id} >{event.name} </a></h2>
                        <h5 className="text-center"><a className="redirect" >{event.participants.length} participants</a></h5>

                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + event.image} />
                            </div>
                            <div className="col-md-6">
                                <ul className="list-unstyled text-left contentEvent">
                                    <li> Date : {
                                        event.hour ?
                                            moment(event.date).format("DD MMMM YYYY") + " à " + event.hour :
                                            moment(event.date).format("DD MMMM YYYY")
                                    }
                                    </li>
                                    <li> Lieu : {event.place}</li>
                                    <li> Code postal : {event.postcode}</li>
                                </ul>
                            </div>
                            <div className="col-md-2 mb-3">
                                <a className="btn btn-primary w-100" href={'/updateEvent/' + event._id} > Modifier </a>
                                <a className="btn btn-primary w-100" onClick={(e) => { paticipateToEvent(event._id) }}> Participer </a>
                            </div>

                        </div>
                    </div>

                )
            })}
        </div>

    );

}

export default AllEvents;

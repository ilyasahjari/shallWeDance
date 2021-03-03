import React, { useState, useEffect } from 'react';
import moment from "moment";
import DatePicker from 'react-datepicker'
import axios from "axios"
import authHeader from '../services/auth-header';

const DeleteEvent = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_EVENT

    const [event, setEvent] = useState({
        name: '',
        eventId: '',
        place: '',
        city: '',
        postcode: 0,
        description: '',
        hour: '',
        date: 'moment().format("DD-MM-YYYY hh:mm:ss")'
    })

    const formData = new FormData()


    const getEvent = async()=>{
        try {
          const _id = props.match.params.eventId
          const eventData = await axios.get(API_URL + "getEvent/" + _id, { headers: authHeader() });
          setEvent(eventData.data)
        } catch (e) {
          console.log(e);
        }
    }

    useEffect( () => {
        getEvent();
    }, [])

    const handleDeleteEvent = async (e) => {
        e.preventDefault()
        try {
        await axios.delete(API_URL + 'delete/'+event._id,{ headers: authHeader() });
        props.history.push('/createdEvents')
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <h1> Supprimer l'événement {event.name} </h1>

            <form onSubmit={ handleDeleteEvent }>
                <input type="submit" value="Supprimer" className="btn btn-danger"/>
            </form>

        </div>
    )
}
export default DeleteEvent;
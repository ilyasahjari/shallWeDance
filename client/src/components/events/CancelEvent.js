import React, { useState, useEffect } from 'react';
import moment from "moment";
import DatePicker from 'react-datepicker'
import axios from "axios"
import authHeader from '../services/auth-header';

const CancelEvent = (props) => {

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

    const [reason,setReason] = useState("")

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

    const handleCancelEvent = async (e) => {
        e.preventDefault()
        try {
        formData.append('_id', event._id);
        formData.append('cancelreason',reason)
        await axios.post(API_URL + 'cancel', formData, { headers: authHeader() });
        props.history.push('/createdEvents')
        }catch (e) {
            console.log(e)
        }
    }

    const onChange  = (e) => {
        setReason(e.target.value)
    }

    return (
        <div>
            <h1> Annuler l'événement {event.name} </h1>

            <form onSubmit={ handleCancelEvent }>
                <div className="form-group">
                    <label htmlFor="cancelreason"> Raison de l'annulation </label>
                    <textarea className="form-control" id="cancelreason" onChange={ onChange}>
                    </textarea>
                </div>
                <input type="submit" value="Envoyer" className="btn btn-primary"/>
            </form>
        </div>
    )
}
export default CancelEvent;

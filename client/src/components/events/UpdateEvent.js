import React, { useState, useEffect } from 'react';
import moment from "moment";
import DatePicker from 'react-datepicker'
import axios from "axios"
import authHeader from '../services/auth-header';

const UpdateEvent = (props) => {

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

  const onChangeEvent = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  }

  const onChangeImage = (e) => {
    formData.append('image',e.target.files[0])
  }

  const handleEventUpdate = async (e) => {
    e.preventDefault()
    try {
      const _id = props.match.params.eventId
      formData.append('_id', _id);
      formData.append('name',event.name);
      formData.append('place',event.place);
      formData.append('city',event.city);
      formData.append('postcode', event.postcode);
      formData.append('description', event.description);
      formData.append('date', event.date);
      formData.append('hour',event.hour);
      await axios.post(API_URL + 'update', formData, { headers: authHeader() })
      props.history.push('/allEvents')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h1> Modification de l'événement { event.name } </h1>
      <form onSubmit={ handleEventUpdate }>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input className="form-control" type="text" id="name" name="name" value={event.name} onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="place"> Lieu </label>
          <input className="form-control" type="text" id="place" name="place" value={event.place} onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="city"> Ville </label>
          <input type="text" id="city" name="city" className="form-control" value={event.city} onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="postcode"> Code postal </label>
          <input type="numer" id="postcode" name="postcode" className="form-control" value={event.postcode} onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="description"> Description </label>
          <textarea id="description" name="description" className="form-control" value={event.description} onChange={onChangeEvent} required> </textarea>
        </div>

        <div className="form-row mb-2">
          <div className="col">
            <label htmlFor="date"> Date </label>
            <input type="date" id="date" name="date" className="form-control" value={event.date} onChange={onChangeEvent} value={moment(event.date).format("YYYY-MM-DD")} required />
          </div>
          <div className="col">
            <label htmlFor="hour"> Heure </label>
            <input type="time" id="hour" name="hour" className="form-control" onChange={ onChangeEvent } defaultValue={event.hour} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image"> Image </label>
          <input type="file" id="image" name="image" className="form-control" onChange={onChangeImage} />
        </div>


        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );

}

export default UpdateEvent;

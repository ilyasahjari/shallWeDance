
import React, { useState,useEffect } from 'react';
import moment from "moment";
import authHeader from '../services/auth-header'
import axios from 'axios'


const AddEvent = (props) => {

  const API_URL = process.env.REACT_APP_API_URL_EVENT
  const API_URL2 = process.env.REACT_APP_API_URL_TYPE


  const [event, setEvent] = useState(
    {
      name: '',
      eventId: '',
      place: '',
      city: '',
      postcode: 0,
      description: '',
      hour: '',
      type: '',
      date: 'moment().format("DD-MM-YYYY hh:mm:ss")'
    })

  const [errorMessage, setErrorMessage] = useState('')
  const formData = new FormData()
  const [types, setTypes] = useState([]);


  const onChangeEvent = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value })
  }

  const onChangeImage = (e) => {
    formData.append('image',e.target.files[0])
  }

  const getAllType = async () => {
    const types = await axios.get(API_URL2+'allTypes')
    setTypes(types.data)
  }

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      formData.append('name',event.name);
      formData.append('place',event.place);
      formData.append('city',event.city);
      formData.append('postcode', event.postcode);
      formData.append('description', event.description);
      formData.append('date', event.date);
      formData.append('hour',event.hour);
      formData.append('type',event.type)     
      await axios.post(API_URL + 'addEvent', formData, { headers: authHeader() })
      localStorage.setItem("setValue","false")
      localStorage.setItem("searchString"," ")
      localStorage.setItem("type"," ")
      props.history.push('/allEvents')
    } catch (e) {
      setErrorMessage(e);
      console.log(e);
    }
  }

 
  useEffect(() => {
    getAllType()
    console.log(process.env.REACT_APP_SECRET_CODE)
  }, [])


  return (
    <div>
      <h1> Ajout d'un événement </h1>

      <form onSubmit={handleAddEvent} encType="multipart/form-data" >
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input className="form-control" type="text" id="name" name="name" onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="place"> Lieu </label>
          <input className="form-control" type="text" id="place" name="place" onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="city"> Ville </label>
          <input type="text" id="city" name="city" className="form-control" onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="postcode"> Code postal </label>
          <input type="numer" id="postcode" name="postcode" className="form-control" onChange={onChangeEvent} required />
        </div>

        <div className="form-group">
          <label htmlFor="type"> Type de danse </label>
          <select className="form-control custom-select" name="type" id="type" onChange={onChangeEvent}>
              <option value="choix" disabled selected name="type"> Type de danse de votre événement</option>

              {
                types.map((type) => {
                    return (
                      <option key={type._id} value={type._id} name="type"> {type.name} </option>
                    )
                })
              }
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description"> Description </label>
          <textarea id="description" name="description" className="form-control" onChange={onChangeEvent} required> </textarea>
        </div>

        <div className="form-row">
          <div className="col">
            <label htmlFor="date"> Date </label>
            <input type="date" id="date" name="date" className="form-control" onChange={ onChangeEvent } value={moment(event.date).format("YYYY-MM-DD")} required />
          </div>
          <div className="col">
            <label htmlFor="hour"> Heure </label>
            <input type="time" id="hour" name="hour" className="form-control" onChange={onChangeEvent} />
          </div>

        </div>

        <div className="form-group">
          <label htmlFor="image"> Image </label>
          <input type="file" id="image" name="image" className="form-control" onChange={onChangeImage} />
        </div>

        <input type="submit" value="Envoyer" className="btn btn-primary" />
      </form>
    </div>

  );
  }

export default AddEvent;

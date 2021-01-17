import React, { useState, useEffect } from 'react';
import moment from "moment";
import DatePicker from 'react-datepicker'
import axios from "axios"
import authHeader from '../services/auth-header';

const UpdateEvent = (props) => {

  const API_URL = "http://localhost:3001/api/event/";

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

  const handleEventUpdate = async (e) => {
    e.preventDefault()
    try {
      const _id = props.match.params.eventId
      const user = await axios.post(API_URL + 'update/' + _id, event, { headers: authHeader() })
      console.log("update user :"+user)
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


        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );

}

// class UpdateEvent extends React.Component{

//   constructor(props){
//     super(props);
//     this.state = {
//       name: '',
//       eventId:'',
//       place: '',
//       city: '',
//       postcode: 0,
//       description: '',
//       hour:'',
//       date : 'moment().format("DD-MM-YYYY hh:mm:ss")'
//     }
//   }

//   componentDidMount() {
//     let eventId = this.props.match.params.eventId;
//     this.setState({eventId : eventId})
//     let json = {"eventId" : eventId};
//     json = JSON.stringify(json);
//     fetch(`http://localhost:3001/api/event/update/${eventId}`, {
//       method: "POST",
//       headers: {
//         'Content-type': 'application/json',
//       },
//       body: json
//     })
//     .then((response) => response.json())
//     .then((result) => {
//       this.setState({name : result.response.name})
//       this.setState({place : result.response.place})
//       this.setState({city : result.response.city})
//       this.setState({postcode : result.response.postcode})
//       this.setState({description : result.response.description})
//       this.setState({date : result.response.date})
//       this.setState({hour : result.response.hour})
//     })
//  }

//   myChangeHandler = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   mySubmitHandler = (e) => {
//     e.preventDefault();
//     console.log(this.state);
//     fetch('http://localhost:3001/api/event/updateEvent', {
//       method: "POST",
//       headers: {
//         'Content-type': 'application/json'
//       },
//       body: JSON.stringify(this.state)
//     })
//     .then((response) => response.json())
//     .then((result) => {
//       console.log(result)
//     })
//   }

//  render() {
//   return (
//     <div>
//       <h1> Modification de l'événement {this.state.name} </h1>
//       <form onSubmit={this.mySubmitHandler}>
//         <div className="form-group">
//           <label htmlFor="name">Nom</label>
//           <input className="form-control" type="text" id="name" name="name" value={this.state.name} onChange={this.myChangeHandler} required/>
//         </div>

//         <div className="form-group">
//           <label htmlFor="place"> Lieu </label>
//           <input className="form-control" type="text" id="place" name="place" value={this.state.place} onChange={this.myChangeHandler} required/>
//         </div>

//         <div className="form-group">
//           <label htmlFor="city"> Ville </label>
//           <input type="text" id="city" name="city" className="form-control" value={this.state.city} onChange={this.myChangeHandler} required/>
//         </div>

//         <div className="form-group">
//           <label htmlFor="postcode"> Code postal </label>
//           <input type="numer" id="postcode" name="postcode" className="form-control" value={this.state.postcode} onChange={this.myChangeHandler} required/>
//         </div>

//         <div className="form-group">
//           <label htmlFor="description"> Description </label>
//           <textarea id="description" name="description" className="form-control" value={this.state.description} onChange={this.myChangeHandler} required> </textarea>
//         </div>

//         <div className="form-row mb-2">
//           <div className="col">
//             <label htmlFor="date"> Date </label>
//             <input type="date" id="date" name="date" className="form-control" value={this.state.date} onChange={this.myChangeHandler} value={moment(this.state.date).format("YYYY-MM-DD")} required/>
//           </div>
//           <div className="col">
//               <label htmlFor="hour"> Heure </label>
//               <input type="time" id="hour" name="hour" className="form-control" onChange={this.myChangeHandler} defaultValue={this.state.hour}/>
//           </div>
//         </div>


//         <input type="submit" value="Envoyer" />
//     </form>
//   </div>

//   );
// }



// }

export default UpdateEvent;

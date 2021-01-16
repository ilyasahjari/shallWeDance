import logo from './logo.svg';
import './App.css';
import React from 'react';
import moment from "moment";
import DatePicker from 'react-datepicker'

class UpdateEvent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      eventId:'',
      place: '',
      city: '',
      postcode: 0,
      description: '',
      hour:'',
      date : '',
      image :'',
      _id :''
    }
    this.formData = new FormData();
  }

  componentDidMount() {
    let eventId = this.props.match.params.eventId;
    this.setState({eventId : eventId})
    let json = {"eventId" : eventId};
    json = JSON.stringify(json);
    fetch('http://localhost:3001/api/event/oneEvent', {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: json
    })
    .then((response) => response.json())
    .then((result) => {
      this.setState({name : result.response.name})
      this.setState({title : result.response.name})
      this.setState({place : result.response.place})
      this.setState({city : result.response.city})
      this.setState({postcode : result.response.postcode})
      this.setState({description : result.response.description})
      this.setState({date : result.response.date})
      this.setState({hour : result.response.hour})
      this.setState({image : result.response.image})
      this.setState({eventId :result.response._id})
    })
 }

  myChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  myChangeHandlerFile = (e) => {
    this.formData.append('image',e.target.files[0])
  }

  mySubmitHandler = (e) => {
    e.preventDefault();
    this.formData.append('name',this.state.name);
    this.formData.append('place',this.state.place);
    this.formData.append('city',this.state.city);
    this.formData.append('postcode',this.state.postcode);
    this.formData.append('description',this.state.description);
    this.formData.append('date',this.state.date);
    if(this.state.hour) {
      this.formData.append('hour',this.state.hour);
    }
    this.formData.append('eventId',this.state.eventId);
    fetch('http://localhost:3001/api/event/updateEvent', {
      method: "POST",
      body: this.formData
    })
    .then((response) => response.json())
    .then((result) => {
      this.props.history.push('/seeEvent/' + this.state.eventId);
    })
  }

 render() {
  return (
    <div>
      <h1> Modification de l'événement {this.state.title} </h1>
      <form onSubmit={this.mySubmitHandler} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input className="form-control" type="text" id="name" name="name" value={this.state.name} onChange={this.myChangeHandler} required/>
        </div>
      
        <div className="form-group">
          <label htmlFor="place"> Lieu </label>
          <input className="form-control" type="text" id="place" name="place" value={this.state.place} onChange={this.myChangeHandler} required/>
        </div>

        <div className="form-group">
          <label htmlFor="city"> Ville </label>
          <input type="text" id="city" name="city" className="form-control" value={this.state.city} onChange={this.myChangeHandler} required/>
        </div>

        <div className="form-group">
          <label htmlFor="postcode"> Code postal </label>
          <input type="numer" id="postcode" name="postcode" className="form-control" value={this.state.postcode} onChange={this.myChangeHandler} required/>
        </div>

        <div className="form-group">
          <label htmlFor="description"> Description </label>
          <textarea id="description" name="description" className="form-control" value={this.state.description} onChange={this.myChangeHandler} required> </textarea>
        </div>

        <div className="form-row mb-2">
          <div className="col">
            <label htmlFor="date"> Date </label>
            <input type="date" id="date" name="date" className="form-control" value={this.state.date} onChange={this.myChangeHandler} value={moment(this.state.date).format("YYYY-MM-DD")} required/>
          </div>
          <div className="col">
              <label htmlFor="hour"> Heure </label>
              <input type="time" id="hour" name="hour" className="form-control" onChange={this.myChangeHandler} defaultValue={this.state.hour}/>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-2">
            <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + this.state.image} />
          </div>
          <div className="col-md-6 mb-2">
            <label htmlFor="image"> Image </label>
            <input type="file" id="image" name="image" className="form-control" onChange={this.myChangeHandlerFile} accept="image/x-png,image/gif,image/jpeg"/>
          </div>
        </div>  
        
        <input type="submit" value="Envoyer" />
    </form>
  </div>
   
  );
}
    


}

export default UpdateEvent;


import React from 'react';
import moment from "moment";
import authHeader from '../services/auth-header'



class AddEvent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      place: '',
      city: '',
      postcode: 0,
      description: '',
      hour :'',
      date : moment(),
    }
    this.formData = new FormData();
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
    this.formData.append('hour',this.state.hour)
    fetch('http://localhost:3001/api/event/addEvent', {
      method: "POST",
      headers: authHeader(),
      body: this.formData
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      this.props.history.push('/seeEvent/' +  result._id);
    })
  }

  render() {
    return (
      <div>
        <h1> Ajout d'un événement </h1>
        <form onSubmit={this.mySubmitHandler} encType="multipart/form-data" >
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input className="form-control" type="text" id="name" name="name" onChange={this.myChangeHandler} required/>
          </div>
        
          <div className="form-group">
            <label htmlFor="place"> Lieu </label>
            <input className="form-control" type="text" id="place" name="place" onChange={this.myChangeHandler} required/>
          </div>

          <div className="form-group">
            <label htmlFor="city"> Ville </label>
            <input type="text" id="city" name="city" className="form-control" onChange={this.myChangeHandler} required/>
          </div>

          <div className="form-group">
            <label htmlFor="postcode"> Code postal </label>
            <input type="numer" id="postcode" name="postcode" className="form-control" onChange={this.myChangeHandler} required/>
          </div>

          <div className="form-group">
            <label htmlFor="description"> Description </label>
            <textarea id="description" name="description" className="form-control" onChange={this.myChangeHandler} required> </textarea>
          </div>

          <div className="form-row">
            <div className="col">
              <label htmlFor="date"> Date </label>
              <input type="date" id="date" name="date" className="form-control" onChange={this.myChangeHandler} value={moment(this.state.date).format("YYYY-MM-DD")} required/>
            </div>
            <div className="col">
              <label htmlFor="hour"> Heure </label>
              <input type="time" id="hour" name="hour" className="form-control" onChange={this.myChangeHandler}/>
            </div>
            
          </div>

          <div className="form-group">
            <label htmlFor="image"> Image </label>
            <input type="file" id="image" name="image" className="form-control" onChange={this.myChangeHandlerFile}/>
          </div>

          <input type="submit" value="Envoyer" />
      </form>
    </div>
     
    );
  }



}

export default AddEvent;

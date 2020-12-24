import logo from './logo.svg';
import './App.css';
import React from 'react';
import moment from "moment";



class AddEvent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      place: '',
      city: '',
      postcode: 0,
      description: '',
      date : moment().format("DD-MM-YYYY hh:mm:ss")
    }
  }

  myChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  mySubmitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
    fetch('http://localhost:3001/api/event/addEvent', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
    })
  }

  render() {
    return (
      <div>
        <h1> Ajout d'un événement </h1>
        <form onSubmit={this.mySubmitHandler}>
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

          <div className="form-group">
            <label htmlFor="date"> Date </label>
            <input type="date" id="date" name="date" className="form-control" onChange={this.myChangeHandler} defaultValue={this.state.date} required/>
          </div>
          <input type="submit" value="Envoyer" />
      </form>
    </div>
     
    );
  }



}

export default AddEvent;

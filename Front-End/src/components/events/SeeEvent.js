import '../../App.css';
import React from 'react';
import moment from "moment";
import authHeader from '../services/auth-header'

class SeeEvent extends React.Component{

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
        fetch('http://localhost:3001/api/event/getEvent/'+ eventId, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                authHeaders()
            }
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
                if(result.response.hour) {
                    this.setState({hour : result.response.hour})
                }
                this.setState({image : result.response.image})
                this.setState({eventId :result.response._id})
            })
    }


    render() {
        return (
            <div>
            <h1> {this.state.title} </h1>

            <div className="row">
            <div className="col-md-3 mb-2">
            <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + this.state.image} />
        </div>

        <ul className="list-unstyled text-left contentEvent">
            <li> Date : {
            this.state.hour?
                moment(this.state.date).format("DD MMMM YYYY") + " à " + this.state.hour :
                moment(this.state.date).format("DD MMMM YYYY")
        }
    </li>
        <li> Lieu : {this.state.place}</li>
        <li> Ville : {this.state.city}</li>
        <li> Code postal : {this.state.postcode}</li>
        <li> Description : {this.state.description}</li>
        </ul>

            </div>

            </div>

    );
    }



}

export default SeeEvent;

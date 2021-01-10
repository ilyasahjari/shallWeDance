import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';

class AllEvents extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            allEvents : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:3001/api/event/allEvents', {
        method: "GET",
        headers: {
            'Content-type': 'application/json',
        }
        })
        .then((response) => response.json())
        .then((result) => {
            this.setState({allEvents : result})
        })
    }

    render() {
        moment.locale('fr');
        return (
             <div className="row">
                 <div className="col-md-3 offset-md-9 mb-10">
                    <a className="btn btn-primary w-100" href={'/addEvent'} > Créer un événement </a>
                 </div>
                 {this.state.allEvents.map(event => (
                     <div className="col-md-12 border border-dark mb-3">
                        <h2 className="text-center">{event.name}</h2>
                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + event.image} />
                            </div>
                            <div className="col-md-6">
                                <ul className="list-unstyled text-left">
                                    <li> Date : {
                                        event.hour?
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
                            </div>
                        </div>
                     </div>
                     
                 ))}
             </div>
        )
    }

}
export default AllEvents;


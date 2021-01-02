import React from 'react';

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
            this.setState({allEvents : result.response})
        })
    }

    render() {
        return (
             <div>
                 {this.state.allEvents.map(event => (
                     <div className="card mt-4">
                         <div className="card-body">
                            <h5 className="card-title">{event.name}</h5>
                            <ul className="list-unstyled text-left">
                                <li> Date : {event.date} </li>
                                <li> Lieu : {event.place}</li>
                                <li> Code postal : {event.postcode}</li>
                            </ul>
                            <a className="btn btn-primary" href={'/updateEvent/' + event._id} > Modifier </a>
                         </div>
                     </div>
                 ))}
             </div>
        )
    }

}
export default AllEvents;


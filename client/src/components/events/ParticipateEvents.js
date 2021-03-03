import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/fr';
import authHeader from '../services/auth-header';
import PaginationPage from '../services/pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faMapMarkerAlt, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const ParticipateEvents = (props) => {

    const [events, setEvents] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL_EVENT

    const[page,setPage] = useState({
        currentPage : 1,
        numberOfEvents : 0,
        numberPerPage : 2,
        numberOfPage : 1
    })

        
    const getEvents = async () => {
        try {
            const events = await axios.get(API_URL + 'participateEvent', { headers: authHeader() })
            page.currentPage = 1
            page.numberOfEvents = events.data.count
            if( page.numberOfEvents % page.numberPerPage === 0)
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
            else
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
            setEvents(events.data.events)
        } catch (e) {
            console.log(e)
        }
    }

    
    useEffect(() => {
        getEvents()
     },[])

    
    const nextPage = async (number) => {
        console.log(number)
    }


     return (
         <div className="mt-5">
            { events.map((event) => {
                return (
                    <div className="col-md-12 border border-dark mb-3 bg-light-grey" key={event._id}>
                        <h2 className="text-center"><a className="color-orange" href={'/seeEvent/' + event._id} >{event.name} </a></h2>
                        <h5 className="text-center"><a className="redirect" >{event.participants.length} participants</a></h5>

                        <div className="row">
                            <div className="col-md-4 mb-2">
                                <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + event.image} />
                            </div>
                    <div className="col-md-6">
                        <ul className="list-unstyled text-left contentEvent">
                        <li className="mb-2 li-event"> <FontAwesomeIcon icon={faCalendarAlt} size="2x" className="mr-2"/>  {
                            event.hour ?
                            moment(event.date).format("DD MMMM YYYY") + " à " + event.hour :
                            moment(event.date).format("DD MMMM YYYY")
                        }
                        </li>
                        <li> <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className="mr-2"/>  {event.place} - {event.postcode}</li>
                        </ul>
                        </div>
                            
                        </div>
                    </div>

                )
            })}
            {
                page.numberOfPage>0 ?
                <PaginationPage
                    pages={page.numberOfPage}
                    nextPage={nextPage}
                    currentPage={page.currentPage}
                >
                </PaginationPage>
                :
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="alert alert-danger" role="alert">
                            Aucun résultat ne correspond à votre recherche 
                        </div>
                    </div>
                </div>
                
            }
         </div>
     )

}


export default ParticipateEvents;

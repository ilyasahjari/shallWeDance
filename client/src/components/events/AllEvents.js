import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/fr';
import authHeader from '../services/auth-header';
import Accueil from '../Accueil';
import {getCurrentUser} from "../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faMapMarkerAlt, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import PaginationPage from '../services/pagination'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import {ModalInviteEvent} from "../services/invite-service"

const AllEvents = (props) => {

    const [events, setEvents] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL_EVENT
    const API_URL2 = process.env.REACT_APP_API_URL_TYPE

    const [types, setTypes] = useState([]);

   
    const paticipateToEvent = async (_id) => {
        try {
            await axios.post(API_URL + "participate/" + _id, { } , { headers: authHeader() })
            window.location.reload();
        } catch (e) {
            console.log(e);
        }
    }

    const getAllType = async () => {
        const types = await axios.get(API_URL2+'allTypes')
        setTypes(types.data)
    }

    const getEvents = async () => {
        try {
            const events = await axios.get(API_URL + 'allEvents')
            page.currentPage = 1
            page.numberOfEvents = events.data.count
            if( page.numberOfEvents % page.numberPerPage === 0)
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
            else
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
            setEvents(events.data.events)
            localStorage.setItem("currentPage",1)
            localStorage.setItem("numberOfEvents",events.data.count)
            if(localStorage.getItem("setValue") == null || localStorage.getItem("setValue")==="false" )
                localStorage.setItem("setValue","true")
            localStorage.setItem("type","all")
            localStorage.setItem("searchString"," ")
        } catch (e) {
            console.log(e)
        }
    }

    const [search, setSearch] = useState({
        searchString: ' ',
        type :'all'
    })

    const[page,setPage] = useState({
        currentPage : 1,
        numberOfEvents : 0,
        numberPerPage : 2,
        numberOfPage : 1
    })

    const onChangeSearch = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value })
        localStorage.setItem(e.target.name,e.target.value)
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if(search.searchString ==="" && localStorage.getItem("searchString")==="")
            search.searchString=" "
        else
            search.searchString = localStorage.getItem("searchString")
        const events = await axios.get(API_URL + 'allEventSearch/'+search.searchString+"/"+search.type, { headers: authHeader() })
        page.currentPage = 1
        page.numberOfEvents = events.data.count
        if( page.numberOfEvents % page.numberPerPage === 0)
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
        else
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
        setEvents(events.data.events)
        localStorage.setItem("searchString",search.searchString)
    }

    const reinitialiser = () => {
        search.searchString=' '
        search.type='all'
        localStorage.setItem("setValue","false")
        localStorage.setItem("searchString"," ")
        localStorage.setItem("type","all")
        getEvents()
    }

    const displaysearch =() => {
        if(localStorage.getItem("searchString") != null)
            return localStorage.getItem("searchString").trim()
        else
            return ""
    }

    useEffect(() => {
        getAllType()
        if(localStorage.getItem("setValue")!="true")
            getEvents();
        else{
            nextPage(parseInt(localStorage.getItem("currentPage")))
        }
    }, [])

    const nextPage = async (number) => {
        if(search.searchString ==="" && localStorage.getItem("searchString")==="")
            search.searchString=" "
        else
            search.searchString = localStorage.getItem("searchString")
        search.type=localStorage.getItem("type")
        const eventsDisplay = await axios.get(API_URL + 'allEventSearch/'+search.searchString+'/'+search.type+"/"+number+'/'+page.numberPerPage, { headers: authHeader() })
        page.currentPage = number
        page.numberOfEvents = eventsDisplay.data.count
        if( page.numberOfEvents % page.numberPerPage === 0)
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
        else
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
        localStorage.setItem("currentPage",number)
        localStorage.setItem("numberOfEvents",eventsDisplay.data.count)
        setEvents(eventsDisplay.data.events)
    }

   

    return (
        <div className="row">
            <form onSubmit={handleSearch} className="col-md-10 example my-5" >
                <div className="form-row">
                    <div className="col mb-2">
                        <select className="form-control" defaultValue={"all"} value={search.type} name="type" id="type" onChange={onChangeSearch}>
                            <option value=" " disabled> Type de danse</option>
                            <option value="all"> Tout type de danse</option>

                            {
                                types.map((type) => {
                                    return (
                                    <option key={type._id} value={type._id}> {type.name} </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col">
                        <input className="form-control" type="text" id="searchString" name="searchString" placeholder="Rechercher" onChange={onChangeSearch} value={displaysearch()} />
                    </div>
                   
                </div>
                <button className="btn btn-secondary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
                <button className="btn btn-danger" onClick={reinitialiser} type="reset">
                    Réinitialiser 
                </button>
            </form>
            { events.map((event) => {
                return (
                    <div className="col-md-12 border border-dark mb-3 bg-light-grey" key={event._id}>
                        <h2 className="text-center"><a className="color-orange" href={'/seeEvent/' + event._id} >{event.name} </a></h2>

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
                            <div className="col-md-2 mb-1">
                                <div className="verticalAlign">
                                    <a className="btn btn-primary w-100 mb-2" onClick={(e) => { paticipateToEvent(event._id) }}> Participer {event.participants.length}  <FontAwesomeIcon icon={faUsers} size="sm" className="mr-2"/> </a>
                                    <ModalInviteEvent event={event}/>
                                </div>
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
                
                <div className="col-md-12">
                    <div className="alert alert-danger" role="alert">
                        Aucun résultat ne correspond à votre recherche 
                    </div>
                </div>
                
                
            }
          

        </div>
    );
}

export default AllEvents;

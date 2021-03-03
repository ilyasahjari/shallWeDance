import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/fr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import authHeader from '../services/auth-header';
import PaginationPage from '../services/pagination'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { faMinusCircle, faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const CreatedEvents = () => {

    const [events, setEvents] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL_EVENT
    const API_URL2 = process.env.REACT_APP_API_URL_TYPE


    const [types, setTypes] = useState([]);


    const[page,setPage] = useState({
        currentPage : 1,
        numberOfEvents : 0,
        numberPerPage : 2,
        numberOfPage : 1
    })


    const getEvents = async () => {
        try {
            const events = await axios.get(API_URL + 'allCreatedEvents', { headers : authHeader() });
            page.currentPage = 1
            page.numberOfEvents = events.data.count
            if( page.numberOfEvents % page.numberPerPage === 0)
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
            else
                page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
            setEvents(events.data.events)
            localStorage.setItem("currentPageCreate",1)
            localStorage.setItem("numberOfEventsCreate",events.data.count)
            if(localStorage.getItem("setValueCreate") == null || localStorage.getItem("setValueCreate")==="false")
                localStorage.setItem("setValueCreate","true")
            localStorage.setItem("searchStringCreate"," ")
            localStorage.setItem("typeCreate","all")
            localStorage.setItem("choiceCreate","all")
        } catch (e) {
            console.log(e)
        }
    }

    const getAllType = async () => {
        const types = await axios.get(API_URL2+'allTypes')
        setTypes(types.data)
    }

    useEffect(() => {
        getAllType();
        if(localStorage.getItem("setValueCreate")!="true")
            getEvents();
        else
            nextPage(parseInt(localStorage.getItem("currentPageCreate")))
    },[])

    const [search, setSearch] = useState({
          searchString: " ",
          choice: "all",
          type : "all"
    })
    
    const onChangeSearch = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value })
        localStorage.setItem(e.target.name+"Create",e.target.value)

    }

    const reinitialiser = () => {
        search.searchString=' '
        search.type='all'
        search.choice='all'
        localStorage.setItem("setValueCreate","false")
        localStorage.setItem("searchStringCreate"," ")
        localStorage.setItem("typeCreate","all")
        localStorage.setItem("choiceCreate","all")
        getEvents()
    }

    const displaysearch =() => {
        if(localStorage.getItem("searchStringCreate") != null)
            return localStorage.getItem("searchStringCreate").trim()
        else
            return ""
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if(search.searchString ==="" && localStorage.getItem("searchStringCreate")==="")
            search.searchString=" "
        else
            search.searchString = localStorage.getItem("searchStringCreate")
        const eventsDisplay = await axios.get(API_URL + 'searchCreatedevent/'+search.searchString+'/'+search.choice+'/'+search.type+"/"+1+'/'+page.numberPerPage, { headers: authHeader() })
        page.currentPage = 1
        page.numberOfEvents = eventsDisplay.data.count
        if( page.numberOfEvents % page.numberPerPage === 0)
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
        else
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
        setEvents(eventsDisplay.data.events)
        localStorage.setItem("searchStringCreate",search.searchString)

    }

    const nextPage = async (number) => {
        if(search.searchString ==="" && localStorage.getItem("searchStringCreate")==="")
            search.searchString=" "
        else
            search.searchString = localStorage.getItem("searchStringCreate")
        search.type = localStorage.getItem("typeCreate")
        search.choice = localStorage.getItem("choiceCreate")
        console.log(search.choice)
        const eventsDisplay = await axios.get(API_URL + 'searchCreatedevent/'+search.searchString+'/'+search.choice+'/'+search.type+"/"+number+'/'+page.numberPerPage, { headers: authHeader() })
        page.currentPage = number
        page.numberOfEvents = eventsDisplay.data.count
        if( page.numberOfEvents % page.numberPerPage === 0)
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage)
        else
            page.numberOfPage = Math.floor(page.numberOfEvents / page.numberPerPage) + 1
        setEvents(eventsDisplay.data.events)
        localStorage.setItem("currentPageCreate",number)
        localStorage.setItem("numberOfEventsCreate",eventsDisplay.data.count)
    }


    return (
        <div className="row">
            <form onSubmit={handleSearch} className="col-md-12 my-5 example" >
                <div className="form-row mb-2">
                    <div className="col-md-2">
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
                    <div className="col-md-2">
                        <select className="form-control" defaultValue={"all"} value={search.choice} id="choice" name="choice" onChange={onChangeSearch}>
                            <option value=" " disabled> État de l'événement </option>
                            <option value="annule"> Annulé</option>
                            <option value="nonannule"> Non annulé</option>
                            <option value="passe"> Passé </option>
                            <option value="all"> Tout </option>
                        </select>
                    </div>
                    <div className="col-md-8">
                        <input className="form-control md-5" type="text" id="searchString" name="searchString" placeholder="Recherche" onChange={onChangeSearch} value={displaysearch()} />
                    </div>
                </div>
                <button className="btn btn-secondary" type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                </button>
                <button className="btn btn-danger" onClick={reinitialiser} type="reset">
                    Réinitialiser 
                </button>
            </form>
            <div className="col-md-3 offset-md-9 mb-10">
                <a className="btn btn-primary w-100 topButton" href={'/addEvent'} > Créer un événement </a>
            </div>
            { events.map((event) => {
                return (
                    <div className="col-md-12 border border-dark mb-3 bg-light-grey" key={event._id}>
                        <h2 className="text-center"><a className="color-orange" href={'/seeEvent/' + event._id} >{event.iscancel? <FontAwesomeIcon icon={faMinusCircle} size="sm" className="color-red" />  : ""} {event.iscancel?"Annulé : "  : ""}{event.name }</a></h2>
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
                            <div className="col-md-2 mb-3">
                                {
                                    event.iscancel ?
                                    <div>
                                        <a className="btn btn-primary w-100" href={'/deleteEvent/' + event._id} > Supprimer </a>
                                    </div>
                                    :
                                    <div>
                                        <a className="btn btn-primary w-100" href={'/updateEvent/' + event._id} > Modifier </a>
                                        <a className="btn btn-primary w-100 mt-2" href={'/cancelEvent/' + event._id} > Annuler </a>
                                    </div>
                                }
                               
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

export default CreatedEvents;









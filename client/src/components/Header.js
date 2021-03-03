import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import 'moment/locale/fr';
import moment from "moment";
import authHeader from './services/auth-header';
import { logout } from './services/auth.service'
import image from '../images/logo.png'
import { getCurrentUser} from "./services/auth.service";
import { Navbar,Nav,NavDropdown,Form,FormControl,Button,Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faBell,faClock,faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';



const Header = () => {

    const API_URL = process.env.REACT_APP_API_URL_NOTIFICATION
    const API_URL_USER = process.env.REACT_APP_API_URL_USER

    const [notifications, setNotifications] = useState([]);

    const [count,setCount] = useState(0)

    const [users, setUsers] = useState([])

    const [selectedUser, setSelectedUser] = useState('')

    const getUsers = async()=>{
        try{
            const users = await axios.get(API_URL_USER+ "allUsers",{headers: authHeader()});
            const usersSearch = users.data.map((user)=>{
                user['label'] = user['firstName'] + " "+user['lastName'];
                user['value'] = user._id;
                
                delete user.lastName
                delete user.firstName
                delete user.following
                delete user.password
                return user
            })

            setUsers(usersSearch)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        getUsers()
    },[])

    let history = useHistory()

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout()
            window.location.href = "login"
        } catch (e) {
            console.log(e);
        }
    }

    const getNotifications = async () => {
        try{
            const notifications = await axios.get(API_URL + 'allNotifsUser/'+getCurrentUser()._id, { headers: authHeader() })
            setNotifications(notifications.data.notifications)
            setCount(notifications.data.count)
        }catch (e) {
            console.log(e);
        }
    }

    function IsConnected() {
        if(getCurrentUser()) {
            return NavConnect()
        }
        return NavNotConnect()
    }

    function diffDate (date) {
        var now = moment(new Date());
        const secondes = Math.round(moment.duration(now.diff(date)).asSeconds());
        const minutes = Math.round(moment.duration(now.diff(date)).asMinutes());
        const hours = Math.round(moment.duration(now.diff(date)).asHours());
        const days = Math.round(moment.duration(now.diff(date)).asDays());
        if(secondes < 60){
           return secondes + " secondes";
        }
        else if(minutes < 60 ){
          return  minutes + " minutes";
        }
        else if (hours < 24){
          return  hours + " heures";
        }
        else{
          return days + " jours";
        }
    }

    const handleClickDrop = async (id,statut,lien) => {
        if(statut==="lu")
            window.location.href=lien
        else{
            try{
                const updateNotification = await axios.get(API_URL + 'changeStatutNotif/'+id, { headers: authHeader() })
                getNotifications()
                window.location.href=updateNotification.data.lien
            }catch (e) {
                console.log(e);
            }
        }  
    }

    const handleClickRead = async () => {
        const id = getCurrentUser()._id
        try{
            const notifications = await axios.get(API_URL + 'setAllNotifsToRead/'+id, { headers: authHeader() })
            setNotifications(notifications.data.notifications)
            setCount(notifications.data.count)
        }catch (e) {
            console.log(e);
        }
    }

    const handleClickDeleteAll = async () => {
        const id = getCurrentUser()._id
        try{
            const notifications = await axios.delete(API_URL + 'deleteAllNotif/'+id, { headers: authHeader() })
            setNotifications([])
            setCount(0)
        }catch (e) {
            console.log(e);
        }
    }

    const handleDeleteClick = async (id) => {
        try{
            const notification = await axios.delete(API_URL + 'deleteNotif/'+id,{ headers: authHeader() })
            setNotifications(notifications.filter(item => item._id !== id))
            setCount(count-1)
        }catch (e) {
            console.log(e);
        }
    }

    const redirectUser =(element)=>{
        setSelectedUser(element.value);
        window.location.replace("/profile/"+element.value)
    }



    function NavConnect() {
        return(
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto ml-10">
                <NavDropdown className="text-light" title="Événements" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/createdEvents">Mes événements crées </NavDropdown.Item>
                    <NavDropdown.Item href="/participateEvents">Mes participations</NavDropdown.Item>
                    <NavDropdown.Item href="/allEvents">Liste des événements</NavDropdown.Item>
                    <NavDropdown.Item href="/addEvent">Créer un événement</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link className="text-light" href="/groupes"> Groupes </Nav.Link>
                <div className="searchProfile">
                    <Select options={users} onChange={redirectUser} placeholder="Danseurs..."/>
                </div>
                </Nav>
                <Nav>
                    <NavDropdown className="text-light" alignRight title={
                       <span className="fa-layers fa-lg">
                       <FontAwesomeIcon icon={faBell} size="lg"/>
                       <span className="fa-layers-counter">{count}</span>
                     </span>
                    }id="collasible-nav-dropdown">
                        <h6 className="dropdown-header text-center"> Notifications ({count}) </h6>
                        <div className="row mx-2">
                            <div className="col-md-6">
                                <button className="btn btn-primary btn-block" onClick={handleClickRead}> Marquer comme lu</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-warning btn-block" onClick={handleClickDeleteAll}> Supprimer</button>
                            </div>
                        </div>
                        {
                            notifications.map((notif) => {
                                return(
                                   
                                    <NavDropdown.Item className="myclass" key={notif._id}>    
                                        <div className={ notif.statut=="nonlu"? "notifications-body nonlu" : "notifications-body" }>
                                            <p className="notification-texte mx-3"> <FontAwesomeIcon icon={faTrashAlt} size="sm" onClick={(e)=> handleDeleteClick(notif._id) }/> <a  onClick={(e) => { handleClickDrop(notif._id,notif.statut,notif.lien) }} > {notif.title} </a> </p>
                                            <p className="notification-date text-muted mx-3">
                                            <FontAwesomeIcon icon={faClock} size="sm"/> {diffDate(notif.createdAt)}
                                            </p>
                                        </div>
                                    </NavDropdown.Item>
                                )
                            })
                        }

                    </NavDropdown>
                    <Nav.Link href="/profile" className="text-light"> <FontAwesomeIcon icon={faUser} size="lg" />  Profil </Nav.Link>
                    <Nav.Link onClick={handleLogout} className="text-light"> Déconnexion </Nav.Link>
                </Nav>
            </Navbar.Collapse>
      )
    }

    function  NavNotConnect() {
        return (<div></div>)
    }

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <Navbar collapseOnSelect expand="lg" className="background-dark">
            <Navbar.Brand href="/"> <img className='imgLogo' src={image} /> </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <IsConnected/>
        </Navbar>
    )
}

export default Header;

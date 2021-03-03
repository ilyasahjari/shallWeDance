import axios from 'axios'
import { useState } from 'react';
import authHeader from '../services/auth-header';
import { Modal, Button } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";
import ReactHTMLDatalist from "react-html-datalist"
import { getCurrentUser} from "../services/auth.service";



export function ModalInviteEvent(props) {

    const API_URL_2 = process.env.REACT_APP_API_URL_USER
    const API_URL_3 = process.env.REACT_APP_API_URL_NOTIFICATION
 

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {
        getUsers()
        getUser()
        setShow(true)
    }

    const [user, setUser] = useState({
        firstName: '',
        lastName:'',
        email: '',
        bornDate: new Date(),
        gendre: 'F',
        bio: '',
        country: '',
        style:'',
        image: ''
    })

    const [notification,setNotification] = useState({
        "receiverdisplay" : [],
        "receiver" : [],
        "statut" : "nonlu",
        "lien" : "/seeEvent/"+props.event._id,
        "title" : getCurrentUser().firstName+" vous invite à participer à l'événement "+props.event.name
    })

    const [users] = useState(
        []
    )

    let userSearched = {};

    const [allUsers, setAllUsers] = useState(
        []
    )

    const handleChange = e => {
        userSearched = e.target.value
    };


    const getUsers = async () => {
        try {
            const usrs = await axios.get(API_URL_2 + 'allUsers',{ headers: authHeader() });
            for (let usr in usrs.data) {
                users.push({text: usrs.data[usr].firstName + ' ' + usrs.data[usr].lastName, value: usrs.data[usr]._id})
            }
            setAllUsers(usrs.data);
        } catch (e) {
            console.log(e)
        }
    }

    function addMembre() {
        allUsers.forEach((usr) => {
            if(usr._id === userSearched && !notification.receiverdisplay.includes(usr)) {
                notification.receiverdisplay = [...notification.receiverdisplay, usr]
                notification.receiver = [...notification.receiver,usr._id]
                userSearched = {};
                setNotification({...notification, ['receiverdisplay']: notification.receiverdisplay})
            }
        })
        console.log(notification)
    }

    const getUser = async () => {
        setUser(getCurrentUser());
    }

    const handleInvite = async (e) => {
        e.preventDefault();
        try{
            setNotification({...notification,['receiverdisplay'] : []})
            await axios.post(API_URL_3 + 'addNotification', notification, { headers: authHeader() })
            setShow(false)
        } catch (e) {
            console.log(e);
        }
    }

    function displayMembres() {
        return (notification.receiverdisplay.map((receiverdisplay) => {
            return (
                <tr key={receiverdisplay._id}>
                <td>
                <img className="avatar" src={process.env.PUBLIC_URL + '/images/' + receiverdisplay.image}/>
            </td>
            <td>
            {receiverdisplay.firstName + ' ' + receiverdisplay.lastName}
            </td>
                <td>
                    <button type="button" className="close" aria-label="Close" onClick={() => deleteRow(receiverdisplay)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
            </td>
            </tr>
        )
        }))
    }

    function deleteRow(receiverdisplay) {
        notification.receiverdisplay.splice(notification.receiverdisplay.indexOf(receiverdisplay), 1);
        setNotification({...notification, ['receiverdisplay']: notification.receiverdisplay})
    }

    return (
      <div>
        <Button variant="primary" className="btn btn-primary w-100" onClick={handleShow} >
          Inviter des amis
        </Button>

        <Modal show={show} onHide={handleClose} centered keyboard={true} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Inviter des amis à l'événement {props.event.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleInvite}>
                <div className="form-group">
                    <label htmlFor="searchUser"> Rechercher un utilisateur </label>
                    <ReactHTMLDatalist
                        name={"searchUser"}
                        onChange={handleChange}
                        classNames={"form-control"}
                        options={users}
                    />
                </div>
            
                <input type="button"  className="btn btn-primary mb-2" onClick={addMembre}  value="Ajouter des amis"/> <br/>
                <div className="row text-center">
                    <div className="table-responsive mt-3 col-md-6 offset-md-3">
                        <table className="table">
                            <thead>
                                <tr>
                                <td></td>
                                <td>Amis à inviter</td>
                                <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {displayMembres() }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <input type="submit" value="Inviter" className="btn btn-primary btn-block" />
                    </div>
                </div>
            </form>
            
        </Modal.Body>
      </Modal>
      </div>
    );
  }
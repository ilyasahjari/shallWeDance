import React, {useEffect, useState} from 'react';
import authHeader from '../services/auth-header'
import axios from 'axios'
import ReactHTMLDatalist from "react-html-datalist"
import {getCurrentUser} from "../services/auth.service";


const ListMembres = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_GROUPE
    const API_URL_2 = process.env.REACT_APP_API_URL_USER

    const [groupe, setGroupe] = useState(
        {
            name: '',
            description: '',
            image: '',
            owner: '',
            membres: []
        })

    const [users] = useState(
        []
    )

    let userSearched = {};

    const [allUsers, setAllUsers] = useState(
        []
    )

    const connectedUser = getCurrentUser();
    const formData = new FormData()


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

    const getEvent = async()=>{
        try {
            const _id = props.match.params.groupeId;
            const groupeData = await axios.get(API_URL + "getGroupe/withMembres/" + _id, { headers: authHeader() });
            return groupeData.data;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getEvent().then((groupe) => {
            setGroupe(groupe);
            console.log(connectedUser)
            console.log(groupe)
            if(groupe.owner === connectedUser._id) {
                getUsers();
            }
        });
    },[])

    const handleChange = e => {
        userSearched = e.target.value
    };

    function addMembre() {
        allUsers.forEach((usr) => {
            if(usr._id === userSearched && !groupe.membres.includes(usr)) {
                groupe.membres = [...groupe.membres, usr];
                userSearched = {};
                setGroupe({...groupe, ['membres']: groupe.membres})
                updateGroupe();
            }
        })
    }

    function deleteRow(membre) {
        groupe.membres.splice(groupe.membres.indexOf(membre), 1);
        setGroupe({...groupe, ['membres']: groupe.membres})
        updateGroupe();
    }

    async function updateGroupe() {
        try {
            const _id = props.match.params.groupeId
            formData.append('_id', _id);
            formData.append('name',groupe.name);
            formData.append('description', groupe.description);
            formData.append('image', groupe.image);
            groupe.membres.forEach((membre) => {
                formData.append('membres', membre._id);
            })
            await axios.post(API_URL + 'update', formData, { headers: authHeader() })
        } catch (e) {
            console.log(e)
        }
    }

    function displayMembres() {
        return (groupe.membres.map((membre) => {
            return (
                <tr key={membre._id}>
                <td>
                <img className="avatar" src={process.env.PUBLIC_URL + '/images/' + membre.image}/>
            </td>
            <td>
            {membre.firstName + ' ' + membre.lastName}
            </td>
            <td>
            { expulseMemberButton(membre) }
            </td>
            </tr>
        )
        }))
    }

    function expulseMemberButton(membre) {
        if(connectedUser._id === groupe.owner) {
        return (
            <button type="button" className="close" aria-label="Close" onClick={() => deleteRow(membre)}>
                <span aria-hidden="true">&times;</span>
            </button>
            )
        } else {
            return;
        }
    }

    function displaySearchBar() {
        if(connectedUser._id === groupe.owner) {
            return (<div>
            <label htmlFor="searchUser"> Rechercher un utilisateur </label>
            <ReactHTMLDatalist
            name={"searchUser"}
            onChange={handleChange}
            classNames={"form-control"}
            options={users}
            />
            <input type="button" className="btn btn-primary" onClick={addMembre}  value="Inviter"/>
                </div>
            )
        } else {
            return;
        }

    }

    return (
        <div>
        <h1> Liste des membres </h1>

        { displaySearchBar() }
        <div className="row">
        <div className="table-responsive mt-3 col-md-6 offset-md-3">
        <table className="table">
            <thead>
                <tr>
                    <td></td>
                    <td>Membres</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                {displayMembres() }
            </tbody>
        </table>
        </div>
        </div>
    </div>

);
}

export default ListMembres;

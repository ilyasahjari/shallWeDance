import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'moment/locale/fr';
import authHeader from '../services/auth-header';
import {getCurrentUser} from "../services/auth.service";


const AllGroupes = () => {

    const [groupes, setGroupes] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL_GROUPE

    const getGroupes = async () => {
        try {
            const grps = await axios.get(API_URL + 'allGroupes',{ headers: authHeader() });
            setGroupes(grps.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getGroupes();
    },[])


    async function leaveGroupe(groupe) {
        const grps = await axios.post(API_URL + 'leave', groupe,{ headers: authHeader() });
        setGroupes(grps.data)
    }

    async function deleteGroupe(groupe) {
        const grps = await axios.delete(API_URL + 'delete/' + groupe._id, { headers: authHeader() });
        setGroupes(grps.data)
    }

    function displayDeleteButton(groupe) {
        if(getCurrentUser()._id === groupe.owner) {
            return(<a className="btn btn-primary w-100 mb-3" onClick={() => deleteGroupe(groupe)} > Supprimer</a>)
        } else {
            return;
        }
    }

    return (
        <div className="row">
            <div className="col-md-3 offset-md-9 mb-10">
            <a className="btn btn-primary w-100 topButton" href={'/addGroupe'} > Créer un groupe </a>
        </div>
    { groupes.map((groupe) => {
        return (
            <div className="col-md-12 border border-dark mb-3 bg-light-grey" key={groupe._id}>
            <h2 className="text-center color-orange">{groupe.name}</h2>
        <div className="row">
            <div className="col-md-4 mb-2">
            <img className="imgEvent" src={process.env.PUBLIC_URL + '/images/' + groupe.image} />
        </div>
        <div className="col-md-6 list-unstyled text-left contentEvent">
        {groupe.description}
        </div>
        <div className="col-md-2 mb-3">
            <a className="btn btn-primary w-100 mb-3" href={'/updateGroupe/' + groupe._id} > Modifier </a>
            <a className="btn btn-primary w-100 mb-3" href={'/listMembres/' + groupe._id} > Voir membres </a>
            <a className="btn btn-primary w-100 mb-3" onClick={() => leaveGroupe(groupe)} > Quitter le groupe</a>
            {displayDeleteButton(groupe)}
            </div>
            </div>
            </div>

    )
    })}

    </div>

);

}

export default AllGroupes;

import React, { useState, useEffect } from 'react';
import axios from "axios"
import authHeader from '../services/auth-header';

const UpdateGroupe = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_GROUPE

    const [groupe, setGroupe] = useState({
        name: '',
        eventId: '',
        place: '',
        city: '',
        postcode: 0,
        description: '',
        hour: '',
        date: 'moment().format("DD-MM-YYYY hh:mm:ss")'
    })
    const formData = new FormData()

    const getEvent = async()=>{
        try {
            const _id = props.match.params.groupeId
            const groupeData = await axios.get(API_URL + "getGroupe/" + _id, { headers: authHeader() });
            setGroupe(groupeData.data)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect( () => {
        getEvent();
    }, [])

    const onChangeGroupe = (g) => {
        setGroupe({ ...groupe, [g.target.name]: g.target.value });
    }

    const onChangeImage = (g) => {
        formData.append('image',g.target.files[0])
    }

    const handleGroupeUpdate = async (e) => {
        e.preventDefault()
        try {
            const _id = props.match.params.groupeId
            formData.append('_id', _id);
            formData.append('name',groupe.name);
            formData.append('description', groupe.description);
            groupe.membres.forEach((membre) => {
                formData.append('membres', membre._id);
            })
            await axios.post(API_URL + 'update', formData, { headers: authHeader() })
            props.history.push('/groupes')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
        <h1> Modification du groupe { groupe.name } </h1>
    <form onSubmit={ handleGroupeUpdate }>
        <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input className="form-control" type="text" id="name" name="name" value={groupe.name} onChange={onChangeGroupe} required />
    </div>


    <div className="form-group">
        <label htmlFor="description"> Description </label>
        <textarea id="description" name="description" className="form-control" value={groupe.description} onChange={onChangeGroupe} required> </textarea>
    </div>

    <div className="form-group">
        <label htmlFor="image"> Image </label>
        <input type="file" id="image" name="image" className="form-control" onChange={onChangeImage} />
    </div>


    <input type="submit" value="Envoyer" />
        </form>
        </div>
);

}

export default UpdateGroupe;

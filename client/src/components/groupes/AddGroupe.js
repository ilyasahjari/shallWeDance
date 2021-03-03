import React, {useEffect, useState} from 'react';
import authHeader from '../services/auth-header'
import axios from 'axios'
import ReactHTMLDatalist from "react-html-datalist"


const AddGroupe = (props) => {

    const API_URL = process.env.REACT_APP_API_URL_GROUPE
    const API_URL_2 = process.env.REACT_APP_API_URL_USER

    const [groupe, setGroupe] = useState(
        {
            name: '',
            description: '',
            membres: []
        })

    const [users] = useState(
        []
    )

    let userSearched = {};

    const [allUsers, setAllUsers] = useState(
        []
    )

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

    useEffect(() => {
        getUsers();
    },[])

    const [errorMessage, setErrorMessage] = useState('')
    const formData = new FormData()


    const onChangeGroupe = (g) => {
        setGroupe({...groupe, [g.target.name]: g.target.value})
    }

    let image;

    const onChangeImage = (g) => {
        image = g.target.files[0];
    }

    const handleAddGroupe = async (e) => {
        e.preventDefault();
        try {
            formData.append('name', groupe.name);
            formData.append('description', groupe.description);
            console.log(image);
            if(image) {
                formData.append('image', image);
            }
            groupe.membres.forEach((membre) => {
                formData.append('membres', membre._id);
            })
            await axios.post(API_URL + 'addGroupe', formData, { headers: authHeader() })
            props.history.push('/groupes')
        } catch (e) {
            setErrorMessage(e);
            console.log(e);
        }
    }

    const handleChange = e => {
        userSearched = e.target.value
    };

    function addMembre() {
        allUsers.forEach((usr) => {
            if(usr._id === userSearched && !groupe.membres.includes(usr)) {
                groupe.membres = [...groupe.membres, usr];
                userSearched = {};
                setGroupe({...groupe, ['membres']: groupe.membres})
            }
        })
    }

    function deleteRow(membre) {
        groupe.membres.splice(groupe.membres.indexOf(membre), 1);
        setGroupe({...groupe, ['membres']: groupe.membres})
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
                    <button type="button" class="close" aria-label="Close" onClick={() => deleteRow(membre)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
            </td>
            </tr>
        )
        }))
    }

    return (
        <div>
        <h1> Ajout d'un groupe </h1>
    <form onSubmit={ handleAddGroupe} encType="multipart/form-data" >
        <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input className="form-control" type="text" id="name" name="name" onChange={onChangeGroupe} required />
    </div>


    <div className="form-group">
        <label htmlFor="description"> Description </label>
        <textarea id="description" name="description" className="form-control" onChange={onChangeGroupe} required> </textarea>
    </div>

    <div className="form-group">
        <label htmlFor="image"> Image </label>
        <input type="file" id="image" name="image" className="form-control" onChange={onChangeImage} />
    </div>
    
    <div>
        <label htmlFor="searchUser"> Rechercher un utilisateur </label>
        <ReactHTMLDatalist
            name={"searchUser"}
            onChange={handleChange}
            classNames={"form-control"}
            options={users}
      />
          <input type="button"  className="btn btn-primary" onClick={addMembre}  value="Inviter"/>
    </div>
        <div className="row">
        <div className="table-responsive mt-3 col-md-6 offset-md-3">
        <table className="table">
        <thead>
        <tr>
        <td></td>
        <td>Membres à inviter</td>
        <td></td>
        </tr>
        </thead>
    <tbody>
    {displayMembres() }
    </tbody>
    </table>
        </div>
    </div>

    <input type="submit" value="Envoyer" className="btn btn-primary" />
        </form>
        </div>

);
}

export default AddGroupe;

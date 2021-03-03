import React, { useState } from 'react';
import moment from "moment";
import authHeader from '../services/auth-header'
import axios from 'axios'


const AddDanseType = (props) => {

    const API_URL2 = process.env.REACT_APP_API_URL_TYPE

    const [name, setName] = useState('')

    const onContentChange = (e) => {
        setName(e.target.value)
    }

    const handleAddType = async (e) => {
        e.preventDefault()
        try {
            await axios.post(API_URL2 + 'addType', { name }, { headers: authHeader() })
            window.location.reload();
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <form onSubmit={handleAddType}>
                <input type="text" name="name" id="name" onChange={onContentChange}/>
                <input type="submit" value="Envoyer" className="btn btn-primary" />
            </form>
        </div>
    )

}
export default AddDanseType;


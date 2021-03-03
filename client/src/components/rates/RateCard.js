import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import authHeader from '../services/auth-header'
import ReactStars from "react-rating-stars-component";
import '../../css/rate.css'

const API_URL = process.env.REACT_APP_API_URL_RATE

const RateCard = (props) => {
    const [rates, setRates] = useState([])
    const [rate, setRate] = useState({
        content: "",
        title: "",
        rate: 0
    })

    const [isOpened, setIsOpened] = useState(false);

    function toggle() {
        setIsOpened(wasOpened => !wasOpened);
    }

    const addRate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL + 'addRate/' + props.idEvent, rate, { headers: authHeader() })
            getRates();
            toggle();
        } catch (e) {
            console.log(e)
        }

    }

    const getRates = async () => {
        try {
            const rates = await axios.get(API_URL + "allRates/" + props.idEvent, { headers: authHeader() });
            setRates(rates.data)
        } catch (e) {
            console.log(e);
        }
    }

    const onRateChange = (e) => {
        setRate({ ...rate, [e.target.name]: e.target.value })
    }

    const onRateStarsChange = (element) => {
        setRate({ ...rate, rate: element })
    }

    useEffect(() => {
        getRates();
    }, [])

    

    return (
        <div >
            <div className="row">
                <div className="col-md-3 offset-md-9">
                    <button className="btn btn-success" onClick={toggle}> Écrire un avis </button>
                </div>
                
                {isOpened && (
                    <div className="col-md-8 offset-md-2">
                        <form onSubmit={addRate}>

                            <div className="form-group">
                                <label htmlFor="content"> Titre de l'avis</label>
                                <input type="text" name="title" onChange={onRateChange} />
                                <label htmlFor="content"> Votre avis sur cette événement ?</label>
                                <textarea className="form-control" type="text" id="content" name="content" onChange={onRateChange} required />
                                <div className="d-flex">
                                    <ReactStars size={40} name="rate" onChange={onRateStarsChange} activeColor="#3B8CF7" />
                                </div>
                            </div>

                            <input type="submit" value="Ajouter mon avis" className="btn btn-primary" />
                        </form>
                    </div>
                )}
            </div>
            { rates.map((rate) => {
                return (
                    <div className="card">
                        <div className="row d-flex">
                            <div className=""> <img className="profile-pic" src={ process.env.PUBLIC_URL + '/images/' + rate.owner.image} /> </div>
                            <div className="d-flex flex-column">
                                <h5 className="mt-2 mb-0">{rate.owner.firstName}{" "}{rate.owner.lastName}</h5>
                                <div>
                                    <p className="text-left"> <ReactStars value={rate.rate} size={30} edit={false}/></p>
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <h4 className="blue-text">"{rate.title}"</h4>
                            <br/>
                            <p className="content"> {rate.content}</p>
                        </div>
                    </div>
                )
            })
            }
        </div>

    )
}

export default RateCard;

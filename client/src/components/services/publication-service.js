import axios from 'axios'
import moment from "moment";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostComments from '../profil/Post'
import authHeader from '../services/auth-header';


const API_URL_2 = process.env.REACT_APP_API_URL_PUBLICATION
const API_URL = process.env.REACT_APP_API_URL_USER



export function diffDate (date) {
    var now = moment(new Date());
    const secondes = Math.round(moment.duration(now.diff(date)).asSeconds());
    const minutes = Math.round(moment.duration(now.diff(date)).asMinutes());
    const hours = Math.round(moment.duration(now.diff(date)).asHours());
    const days = Math.round(moment.duration(now.diff(date)).asDays());
    if(secondes < 60){
       return "Il y a " + secondes + " secondes";
    }
    else if(minutes < 60 ){
      return "Il y a " + minutes + " minutes";
    }
    else if (hours < 24){
      return "Il y a "+ hours + " heures";
    }
    else{
      return "Il y a "+ days + " jours";
    }
}



export function AllPublications(props){
    const [isClickedComment, setIsClickedComment] = useState(false);

   
    const showCommentField = () => {
        setIsClickedComment(!isClickedComment)
    }

    const likePublication =(_id) => {
        props.likePublication(_id)
    }

    const unLikePublicaton = (_id) => {
        props.unLikePublicaton(_id)
    }
   
    const likeButton =(publiLikes, id,userid,props) => {
        if (publiLikes.indexOf(userid) >= 0) {
            return <button className="btn btn-danger btn-block" onClick={(e) => { unLikePublicaton(id); } }> Je n'aime plus</button>;
        }
        else {
            return <button className="btn btn-primary btn-block" onClick={(e) => { likePublication(id); } }> J'aime</button>;
        }
    }

   
    return (
        <div className="row">
        {
            props.publications.map((publi) => {
                    return(
                        <div className="col-md-12" key={publi._id}>
                            <div className="post">
                                <div className="post-header col-md-4">
                                    
                                        <img className="avatar" src={process.env.PUBLIC_URL + '/images/' +  publi.owner.image  } />
                                    
                                        <div className="details">
                                                <span className="mx-4"> <Link to={"/profile/"+ publi.owner._id}>{publi.owner.firstName}</Link> 
                                                {publi.event && props.isContent ? <div>{'->'} <Link to={"/seeEvent/"+ publi._id} className='color-orange'> {publi.event.name} </Link></div> : ""} 
                                                </span>
                                                <span className="mx-2"> { diffDate(publi.createdAt) } </span>
                                        </div>

                                </div>

                                <h1 className="post-content col-md-2">{ publi.content} </h1>
                                {
                                    publi.image ?  <img src={process.env.PUBLIC_URL + '/images/' + publi.image} className="imgPost"></img> : ""
                                }
                                <br/>
                                <br/>
                             <div className="row">
                                <div className="col-md-4">
                                    {likeButton(publi.likes,publi._id,props.user._id)}
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-primary btn-block" onClick={showCommentField}> Commenter</button>
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-primary btn-block"> Partager</button>
                                </div>
                            </div>

                            <PostComments comments={publi.comments} isClickedComment={isClickedComment} idPub= {publi._id}/>

                            </div>
                           
                        </div>
                )
                }
            )
        }
        </div>
);
}




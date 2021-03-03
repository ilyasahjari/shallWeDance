import React, { useState } from "react";
import '../../css/posts.css'
import axios from 'axios'
import authHeader from '../services/auth-header';
import { getCurrentUser } from "../services/auth.service";
import { Link } from "react-router-dom";


const API_URL_3 = process.env.REACT_APP_API_URL_COMMENT


function PostHeader({ author, date }) {
    return (
        <div className="post-header">
            <img className="avatar" />
            <div className="details">
                <span>Ilyas</span>
                <span>21/09/2020</span>
            </div>
        </div>
    );
}

function PostComments(props) {
    
    const [content, setContent] = useState('')
    const [comments, setComments]= useState(props.comments? props.comments:[])

    const onContentChange = (e) => {
        setContent(e.target.value)
    }


    const handleAddComment = async (e) => {
        e.preventDefault()
        try {
            let comment = await axios.post(API_URL_3 + 'addComment/'+props.idPub, { content }, { headers: authHeader() })
            comment.data.owner = await getCurrentUser();
            setComments([...comments, comment.data])
            setContent('')
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className="post-comments">

            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    <img className="avatar" src={process.env.PUBLIC_URL + '/images/' + comment.owner.image} />
                    <p>
                        <Link to={"/profile/"+comment.owner._id}><span>{comment.owner.firstName + ' ' + comment.owner.lastName}</span></Link>
                        {comment.content}
                    </p>
                </div>
            ))}
            {
                props.isClickedComment &&
                <div>
                    <input value={content} onChange={onContentChange}>
                    </input>
                    <button className="btn btn-primary" onClick={handleAddComment}>send</button>
                </div>
            }
        </div>
    );
}



export default PostComments;

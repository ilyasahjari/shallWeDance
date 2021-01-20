import React, { useState } from "react";
import '../../css/posts.css';



function PostHeader({ author, date }) {
    return (
        <div className="post-header">
            <img className="avatar"/>
            <div className="details">
                <span>Ilyas</span>
                <span>21/09/2020</span>
            </div>
        </div>
    );
}

function PostComments({ comments }) {
    const [isCommentInput, setIsCommentInput] = useState(false)

    const handleCommentShow = () => {
        setIsCommentInput(!isCommentInput)
    }

    return (
        <div className="post-comments">
            <div className="divider" />

            <button className="reply-btn">Like</button>
            <button className="reply-btn" onClick={handleCommentShow}> Comment</button>
            <div className="comment">
                <img className="avatar" />
                <p>
                    <span>ilyas</span>
                    hello !
                </p>
            </div>

            {/* {comments.map(comment => (
        <div key={comment.id} className="comment">
          <img className="avatar" src={comment.author.avatar} />
          <p>
            <span>{comment.author.name}</span>
            {comment.content}
          </p>
        </div>
      ))} */}
            {
                isCommentInput &&
                <div>
                    <input>
                    </input>
                    <button>send</button>
                </div>
            }
        </div>
    );
}

function PostItem() {
    return (
        <div className="post">
            <PostHeader />
            <p className="post-content">Hello everybody !!</p>
            <PostComments />
        </div>
    );
}

export default PostItem;
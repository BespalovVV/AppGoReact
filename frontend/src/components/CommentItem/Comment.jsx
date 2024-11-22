import React from 'react';
import './Comment.css'; // Импортируйте стили, если нужно
import MyButton from '../UI/button/MyButton';
import PostService from '../../API/PostService';

const Comment = ({...props}) => {
    const deleteComment = async () => {
        const response = await PostService.DeleteComment(props.comment.id);
        
    };
    return (
        <div className="comment">
            <a href={'/profile/' + props.comment.owner_id} className="comment-username">
                {props.username}
            </a>
            
            {props.comment.owner_id == localStorage.getItem('user_id') || props.post == localStorage.getItem('user_id')
                ? <div>
                    <p className="comment-text">{props.comment.body}</p>
                    <MyButton className="red" onClick={deleteComment}>Удалить</MyButton>
                </div>
                : <p className="comment-text">{props.comment.body}</p>
            }
        </div>
    );
};

export default Comment;
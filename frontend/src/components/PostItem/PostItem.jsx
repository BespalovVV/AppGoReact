import React from "react";
import MyButton from "../UI/button/MyButton";
import { Link, useNavigate } from 'react-router-dom';
import './PostItemM.css';
import UserService from "../../API/UserService";
import PostService from "../../API/PostService";

const PostItem = (props) => {

    const navigate = useNavigate()

    const DeletePost = () => {
        const response = PostService.DeletePost(props.post.id);
        console.log(`Удалить пост ${props.post.id}`);
    };
    return (
        <div className="post">
            <div className="post-header">
                <Link to={`/profile/${props.post.owner_id}`} className="user-name">
                    профиль пользователя
                </Link>
            </div>
            <h2 className="post-title">{props.post.title}</h2>
            {props.imgurl && <img src={props.imgurl} alt={props.post.title} className="post-image" />}
            <h3 className="post-content">{props.post.body}</h3>
            <div>
                <MyButton className="green" onClick={() => navigate(`/posts/${props.post.id}`)}>Открыть</MyButton>
                {props.post.owner_id == localStorage.getItem('id') ?<MyButton className="red" onClick={DeletePost}>Удалить</MyButton> :''}
            </div>
        </div>
    );
}
export default PostItem;
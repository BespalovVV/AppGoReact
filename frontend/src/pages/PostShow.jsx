import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import PostService from "../API/PostService";
import MyLoading from "../components/UI/Loader/MyLoading";
import MyButton from "../components/UI/button/MyButton";
import MyInput from "../components/UI/input/MyInput";
import PostItem from "../components/PostItem/PostItem";
import Comment from "../components/CommentItem/Comment";

const PostShow = () => {
    const params = useParams();
    const [post, setPost] = useState({});
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [img, setImg] = useState([]);

    const [fetchPostById, isPostLoading, postError] = useFetching(async () => {
        try {
            const response = await PostService.getById(params.id);
            setPost(response.data);
            setImg(response.data.image.String);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            throw new Error(errorMessage);
        }
    });

    const [fetchComments, isCommLoading, commError] = useFetching(async () => {
        try {
            const response = await PostService.getCommentsByPostId(params.id);
            setComments(response.data);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            throw new Error(errorMessage);
        }
    });

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            try {
                const response = await PostService.CreateComment({
                    owner_id: localStorage.getItem('user_id'),
                    body: commentText,
                    post_id: post.id
                });
                const newComment = { 
                    owner_id: localStorage.getItem('user_id'), 
                    body: commentText, 
                    post_id: post.id 
                };
                setComments([...comments, newComment]);
                setCommentText('');
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    useEffect(() => {
        fetchPostById();
        fetchComments();
    }, []);

    return (
        <div>
            {isPostLoading ? (
                <MyLoading />
            ) : postError ? (
                <div style={{textAlign: 'center'}} className="error-message">Error loading post: {postError}</div>
            ) : (
                <PostItem post={post} imgurl={img} />
            )}
            {!postError ?<div>
                <h3>Комментарии</h3>
                {isCommLoading ? (
                    <MyLoading />
                ) : commError ? (
                    <div className="error-message">Error loading comments: {commError}</div>
                ) : (
                    comments.map((comment, index) => (
                        <Comment
                            key={index}
                            username="nameuser"
                            comment={comment}
                            post={post.owner_id}
                        />
                    ))
                )}
                <div className="add-comment">
                    <MyInput
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ваш комментарий"
                    />
                    <MyButton className="green" onClick={handleAddComment}>
                        Добавить комментарий
                    </MyButton>
                </div>
            </div> 
            :''}
            
        </div>
    );
};

export default PostShow;
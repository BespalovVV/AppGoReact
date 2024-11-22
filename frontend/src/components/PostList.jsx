import React from "react";
import PostItem from "./PostItem/PostItem";

const PostList = ({ posts, title, remove }) => {
    if (!posts.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>Новости не найдены</h1>
        )
    }
    return (
        <div>
            <h1 style={{ textAlign: 'center', width: '100%' }}>{title}</h1>
            {posts.map((post, index) => (
                <PostItem 
                    key={post.id} 
                    remove={remove} 
                    number={index + 1} 
                    post={post}
                    imgurl={post.image ? post.image.String : ""}
                />
            ))}
        </div>
    )
}

export default PostList;
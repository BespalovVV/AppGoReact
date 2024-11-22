import React from "react";
import './Error.css'
import MyButton from "../UI/button/MyButton";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();

    const handlePostsRedirect = () => {
        navigate(`/posts`); // Замените на ваш маршрут профиля
    };
    
    return (
        <div className="container">
            <h1 className="error-code">404</h1>
            <p className="error-message">Упс! Страница не найдена.</p>
            <MyButton onClick={handlePostsRedirect} className="green">Вернуться к постам</MyButton>
        </div>
    );
};

export default Error;
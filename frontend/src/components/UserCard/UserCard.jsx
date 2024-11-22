import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCard.css'; // Импортируем обычный CSS
import MyButton from '../UI/button/MyButton';
import UserService from '../../API/UserService';

const UserCard = ({ user, className, textV, classV, textC }) => {
    const navigate = useNavigate();

    const handleProfileRedirect = () => {
        navigate(`/profile/${user.id}`); // Замените на ваш маршрут профиля
    };
    const handleAddFriend = () => {
        const response = UserService.SendInvite(user.id);
        console.log(`Добавить ${user.name} ${user.surname} в друзья`);
    };
    const handleDeleteInvite = () => {
        const response = UserService.DeleteInvite(user.id)
        console.log(`Отклонить ${user.name} ${user.surname} приглашение`);
    };
    const handleAcceptInvite = () => {
        const response = UserService.AcceptInvite(user.id)
        console.log(`принять ${user.name} ${user.surname} приглашение`);
    };
    const handleDeleteFriend = () => {
        const response = UserService.DeleteFriend(user.id)
        console.log(`Удалить ${user.name} ${user.surname} из друзья`);
    };
    return (
        <div className={`card ${className}`}>
            <img src={user.image.String} alt={`${user.name} ${user.surname}`} className="photo" onClick={handleProfileRedirect} />
            <div className="info">
                <div className="name" onClick={handleProfileRedirect}>
                    {user.name} {user.surname}
                </div>
                {classV == 'green'
                    ? <MyButton onClick={handleAddFriend} className={`${classV}`}>
                        {textV}
                    </MyButton>
                    : classV == 'red'
                        ? <MyButton onClick={handleDeleteFriend} className={`${classV}`}>
                            {textV}
                        </MyButton>
                        : classV == 'invite b'
                            ?<div> <MyButton onClick={handleDeleteInvite} className={`red`}>
                                {textC}
                            </MyButton>
                            <MyButton onClick={handleAcceptInvite} className={`green`}>
                                {textV}
                            </MyButton>
                            </div>
                            :<MyButton onClick={handleDeleteInvite}>
                            {textV}
                        </MyButton>
                }
            </div>
        </div>
    );
};

export default UserCard;
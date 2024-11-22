import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard/UserCard';
import MyInput from '../components/UI/input/MyInput';
import { useFetching } from '../hooks/useFetching';
import UserService from '../API/UserService';

const FriendsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [fetchUsersNotFriend, isUsersLoading, error] = useFetching(async () => {
        const responce = await UserService.GetUsersFriend()
        setUsers(responce.data);
    })
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        fetchUsersNotFriend();
    }, [])

    return (
        <div>
            <h1>Поиск друзей</h1>
            <MyInput
                type="text"
                placeholder="Введите имя или фамилию"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} classV="red" textV="Удалить из друзей"/>
                    ))
                ) : (
                    <p>Пользователи не найдены</p>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
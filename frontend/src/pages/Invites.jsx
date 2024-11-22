import React, { useEffect, useState } from 'react';
import MyButton from '../components/UI/button/MyButton';
import UserService from '../API/UserService';
import { useFetching } from '../hooks/useFetching';
import MyLoading from '../components/UI/Loader/MyLoading';
import UserCard from '../components/UserCard/UserCard';

const FriendInvites = () => {
    const [invites, setInvites] = useState([]);
    const [sentInvites, setSentInvites] = useState([]);
    const [receivedInvites, setReceivedInvites] = useState([]);
    const [activeTab, setActiveTab] = useState('received');
    const [users, setUsers] = useState({}); // Состояние для пользователей

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const fetchInvites = async () => {
        try {
            const response = await UserService.GetInvites();
            setInvites(response.data);

            const userId = localStorage.getItem('id');
            const received = response.data.filter(invite => invite.to_id == userId);
            const sent = response.data.filter(invite => invite.from_id == userId);

            setSentInvites(sent);
            setReceivedInvites(received);

            // Загружаем пользователей по их ID
            const allUserIds = [...new Set([...sent.map(i => i.to_id), ...received.map(i => i.from_id)])];

            // Получаем данные пользователей асинхронно
            const userPromises = allUserIds.map(id => UserService.getUserById(id));
            const userResponses = await Promise.all(userPromises);

            const usersMap = {};
            userResponses.forEach(userResponse => {
                usersMap[userResponse.data.id] = userResponse.data; // Предполагается, что у пользователя есть поле id
            });

            setUsers(usersMap);
        } catch (error) {
            console.error("Ошибка при загрузке приглашений или пользователей:", error);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);
    return (
        <div style={{ padding: '20px', textAlign: "center" }}>
            <h1>Приглашения в друзья</h1>
            <div style={{ display: 'flex', justifyContent: "space-between", marginBottom: '20px' }}>
                <MyButton
                    onClick={() => handleTabChange('received')}
                    className={activeTab === 'received' ? 'green active' : 'green'}
                >
                    Полученные
                </MyButton>
                <MyButton
                    onClick={() => handleTabChange('sent')}
                    className={activeTab === 'sent' ? 'green active' : 'green'}
                >
                    Отправленные
                </MyButton>
            </div>

            <div style={{ marginTop: '20px' }}>
                {activeTab === 'received' && (
                    <ul>
                        {receivedInvites.map((invite) => (
                            <li key={invite.id}>
                                {users[invite.from_id] ? (
                                    <UserCard user={users[invite.from_id]} classV="invite b" textV="принять" textC="отклонить" />
                                ) : (
                                    <MyLoading />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                {activeTab === 'sent' && (
                    <ul>
                        {sentInvites.map((invite) => (
                            <li key={invite.id}>
                                {users[invite.to_id] ? (
                                    <UserCard user={users[invite.to_id]} textV="отменить" />
                                ) : (
                                    <MyLoading />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendInvites;
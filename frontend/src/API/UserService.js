import axios from "axios";
import Endpoint from "./endpoints";
import { getToken, setToken } from './PostService'; // Импортируем getToken и setToken

// Функция для добавления заголовков авторизации
function getAuthHeaders() {
    const token = getToken(); // Получаем токен из localStorage
    if (!token) {
        localStorage.removeItem('auth');
        throw new Error("Access token not found");
    }
    return {
        Authorization: `Bearer ${token}`,
    };
}

// Получение refresh токена из localStorage
function getRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token'); // Получаем refresh token из localStorage
    if (!refreshToken) {
        localStorage.removeItem('auth');
        throw new Error('Refresh token not found');
    }
    return refreshToken;
}

// Функция для обновления access токена
async function refreshAccessToken() {
    const refreshToken = getRefreshToken(); // Получаем refresh token из localStorage

    try {
        const response = await axios.post('http://localhost:8080/refresh', 
            { refresh_token: refreshToken }, 
            { withCredentials: true }  // Включаем отправку куки
        );
        const newAccessToken = response.data.access_token;

        // Сохраняем новый токен в localStorage
        setToken('access_token', newAccessToken);
        

        return newAccessToken;
    } catch (e) {
        console.error("Ошибка при обновлении токена:", e);
        localStorage.removeItem('auth');
        throw new Error("Session expired, please log in again.");
    }
}

// Метод для повторного выполнения запроса с обновленным токеном
async function sendRequestWithRetry(request) {
    try {
        const response = await request(); // Пробуем выполнить запрос
        return response;
    } catch (e) {
        if (e.response && e.response.status === 401) {
            // Ошибка 401 - токен устарел, пробуем обновить токен
            try {
                const newAccessToken = await refreshAccessToken();
                
                // Повторяем запрос с новым токеном
                const response = await request(newAccessToken);
                return response;
            } catch (refreshError) {
                // Ошибка при обновлении токена
                console.error('Ошибка при обновлении токена', refreshError);
                throw new Error('Session expired, please log in again.');
            }
        }
        throw e; // Если ошибка не 401, пробрасываем её дальше
    }
}

export default class UserService {
    static async CreateUser(data) {
        const URL = 'http://localhost:8080/registration';
        return sendRequestWithRetry(() => axios.post(URL, data, { withCredentials: true }));
    }

    static async getUserById(id) {
        const URL = `${Endpoint.HOST}api/users/${id}`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async loginUser(data) {
        const URL = 'http://localhost:8080/login';
        return sendRequestWithRetry(() => axios.post(URL, data, { withCredentials: true }));
    }

    static async GetUsersNotFriend() {
        const URL = `${Endpoint.HOST}api/notfriends`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async GetUsersFriend() {
        const URL = `${Endpoint.HOST}api/friends`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async SendInvite(id) {
        const URL = `${Endpoint.HOST}api/invites`;
        id = Number(id);
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.post(URL, { "to_id": id }, { headers, withCredentials: true });
        });
    }

    static async AcceptInvite(data) {
        const URL = `${Endpoint.HOST}api/inviteaccept`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.post(URL, {"from_id": data}, { headers, withCredentials: true });
        });
    }

    static async DeleteInvite(data) {
        const URL = `${Endpoint.HOST}api/invites`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.delete(URL, {
                headers: headers,
                data: { front_id: data },
                withCredentials: true
            });
        });
    }

    static async DeleteFriend(id) {
        const URL = `${Endpoint.HOST}api/friends/${id}`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.delete(URL, { headers, withCredentials: true });
        });
    }

    static async GetInvites() {
        const URL = `${Endpoint.HOST}api/invites`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.get(URL, { headers, withCredentials: true });
        });
    }
    static async UpdateUser(id, data) {
        const URL = `${Endpoint.HOST}api/users/${id}`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.patch(URL, data, { headers, withCredentials: true });
        });
    }
    static async IsFriend(id) {
        const URL = `${Endpoint.HOST}api/friends/${id}`;
        return sendRequestWithRetry(async (newAccessToken) => {
            const headers = newAccessToken ? { 'Authorization': `Bearer ${newAccessToken}` } : getAuthHeaders();
            return axios.get(URL, { headers, withCredentials: true });
        });
    }
}
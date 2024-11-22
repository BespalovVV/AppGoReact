import axios from "axios";
import Endpoint from "./endpoints";

// Функция для получения токена из localStorage
export function getToken() {
    return localStorage.getItem('access_token'); // Получаем токен из localStorage
}

// Функция для установки токена в localStorage
export function setToken(tokenName, tokenValue) {
    localStorage.setItem(tokenName, tokenValue); // Сохраняем токен в localStorage
}

// Функция для удаления токена из localStorage
export function removeToken() {
    localStorage.removeItem('access_token'); // Удаляем токен из localStorage
}

// Общий метод для добавления заголовков авторизации
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
        // Запрос на сервер для обновления access токена с использованием refresh токена
        const response = await axios.post('http://localhost:8080/refresh', 
            { refresh_token:  refreshToken }, 
            { withCredentials: true }  // Включаем отправку куки
        );
        const newAccessToken = response.data.access_token;
        
        // Сохраняем новый токен в localStorage
        setToken('access_token', newAccessToken);
        localStorage.setItem('refresh_token', response.data['refresh_token'])

        return newAccessToken;
    } catch (e) {
        console.error("Ошибка при обновлении токена:", e);
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

export default class PostService {
    static async getAll() {
        return sendRequestWithRetry(async () => {
            const URL = Endpoint.HOST + 'api/posts';
            const headers = getAuthHeaders();
            return await axios.get(URL, { headers, withCredentials: true }); // Включаем отправку куки
        });
    }

    static async getById(id) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/posts/${id}`;
            const headers = getAuthHeaders();
            return await axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async getCommentsByPostId(id) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/posts/${id}/comments`;
            const headers = getAuthHeaders();
            return await axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async CreatePost(data) {
        data.isprivate = data.isprivate === true;
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/posts`;
            const headers = getAuthHeaders();
            return await axios.post(URL, data, { headers, withCredentials: true });
        });
    }

    static async CreateComment(data) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/comments`;
            const headers = getAuthHeaders();
            return await axios.post(URL, data, { headers, withCredentials: true });
        });
    }

    static async GetUserPost(id) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/users/${id}/posts`;
            const headers = getAuthHeaders();
            return await axios.get(URL, { headers, withCredentials: true });
        });
    }

    static async DeleteComment(id) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/comments/${id}`;
            const headers = getAuthHeaders();
            return await axios.delete(URL, { headers, withCredentials: true });
        });
    }
    static async DeletePost(id) {
        return sendRequestWithRetry(async () => {
            const URL = `${Endpoint.HOST}api/posts/${id}`;
            const headers = getAuthHeaders();
            return await axios.delete(URL, { headers, withCredentials: true });
        });
    }
}

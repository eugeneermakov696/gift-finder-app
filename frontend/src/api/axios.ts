import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            if (originalRequest._isRetry || originalRequest.url?.includes('auth/refresh/')) {
                // window.location.href = `${import.meta.env.BASE_URL}login`;
                // uncomment it when u will have the login page
                return Promise.reject(error);
            }

            originalRequest._isRetry = true;

            try {
                await axiosInstance.post('auth/refresh/');

                return axiosInstance.request(originalRequest);
            } catch (refreshError) {
                // window.location.href = `${import.meta.env.BASE_URL}login`;
                return Promise.reject(refreshError);
            }
        }
        if (error.response && error.response.status === 403) {
            // TODO for Maksym: here we have situation when user is logged in
            // but doesn't have permissions to do something
            // so you can redirect user from the forbidden page or show modal window or smth else.
            console.error("403 Forbidden");
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/user/register`, credentials);

        let { username, email } = credentials;

        /** send email */
        // if(status === 201){
            // await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        // }

        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({ error })
    }
}

/***/
// API library for user requests
/***/
import { getData } from './api';

export const userDomain = 'https://jsonplaceholder.typicode.com';
export const allUserRoute = '/users';

export async function getUsers() {
    const body = await getData(userDomain + allUserRoute);
    return body;
};

export async function getUser(id) {
    const body = await getData(userDomain + allUserRoute + `/${id}`);
    return body;
}

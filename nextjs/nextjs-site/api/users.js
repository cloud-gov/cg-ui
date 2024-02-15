/***/
// API library for user requests
/***/
import { getData } from './api';

export const allUserRoute = 'https://jsonplaceholder.typicode.com/users';

export async function getUsers() {
    const body = await getData(allUserRoute);
    return body;
};

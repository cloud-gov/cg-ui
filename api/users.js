/***/
// API library for user requests
/***/
import { getData } from './api';

export const userDomain = 'https://jsonplaceholder.typicode.com';
export const allUserRoute = '/users';

export async function getUsers() {
  try {
    const body = await getData(userDomain + allUserRoute);
    return body;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUser(id) {
  try {
    const body = await getData(userDomain + allUserRoute + `/${id}`);
    return body;
  } catch (error) {
    throw new Error(error.message);
  }
}

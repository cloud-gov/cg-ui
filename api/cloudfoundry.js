/***/
// API library for cloud foundry requests
/***/
import { getData } from './api';

const CF_API_URL = process.env.CF_API_URL;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

export async function getCFApps() {
  try {
    const body = await getData(CF_API_URL + '/apps', {
      headers: {
        Authorization: CF_API_TOKEN,
      },
    });
    if (body.resources) {
      return body.resources;
    } else {
      throw new Error('resources not found');
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

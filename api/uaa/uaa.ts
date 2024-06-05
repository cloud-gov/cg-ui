'use server';
/***/
// API library for cloud foundry
// User account and authentication (UAA)
/***/

import { request } from '@/api/api';
import { getToken } from '@/api/cf/token';
import { UsersFieldList } from '@/api/uaa/uaa-types';

const UAA_API_URL = process.env.UAA_API_URL || process.env.UAA_ROOT_URL;

async function uaaRequest(path: string): Promise<Response> {
  try {
    const options = {
      headers: {
        Authorization: `bearer ${getToken()}`,
        Accept: 'application/json',
      },
    };
    return await request(UAA_API_URL + path, options);
  } catch (error: any) {
    if (process.env.NODE_ENV == 'development') {
      console.error(
        `request to ${path} failed: ${error.statusCode} -- ${error.message}`
      );
    }
    throw new Error(`something went wrong: ${error.message}`);
  }
}

/***/
// ENDPOINT SPECIFIC FUNCTIONS
/***/

// USERS

export async function getUsers(
  fields: UsersFieldList[],
  filterField?: UsersFieldList,
  filterValues?: string[]
): Promise<Response> {
  const attributes = fields.join(',');
  if (filterField && filterValues) {
    const filterString = filterValues
      .map((value) => {
        return `${filterField}+eq+"${value}"`;
      })
      .join('+or+');
    return await uaaRequest(
      `/Users?attributes=${attributes}&filter=${filterString}`
    );
  }
  return await uaaRequest(`/Users?attributes=${attributes}`);
}

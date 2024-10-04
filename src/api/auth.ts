/***/
// API library for auth requests
/***/

// Types

export interface UAATokenRequestObj extends Record<string, string> {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  response_type: 'token';
}

export interface UAATokenRefreshObj extends Record<string, string> {
  grant_type: 'refresh_token';
  refresh_token: string;
  client_id: string;
  client_secret: string;
}

export interface UAATokenResponseObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

// Functions

export async function postToAuthTokenUrl(
  payload: UAATokenRequestObj | UAATokenRefreshObj
): Promise<UAATokenResponseObj> {
  try {
    const body = new URLSearchParams(payload).toString();
    let url;
    if (process.env.UAA_ROOT_URL && process.env.UAA_TOKEN_PATH) {
      url = process.env.UAA_ROOT_URL + process.env.UAA_TOKEN_PATH;
    } else {
      throw new Error(
        'UAA_ROOT_URL and UAA_TOKEN_PATH environment variables are not set'
      );
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.json();
      throw new Error(
        `an error occurred with response code ${response.status}, error: ${data.error}, error_description: ${data.error_description}, original body: ${body}`
      );
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

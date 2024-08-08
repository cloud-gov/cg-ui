/***/
// API library for auth requests
/***/

export async function postToAuthTokenUrl(payload) {
  try {
    const body = new URLSearchParams(payload).toString();
    const url = process.env.UAA_ROOT_URL + process.env.UAA_TOKEN_PATH;
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
  } catch (error) {
    throw new Error(error.message);
  }
}

/***/
// API library for auth requests
/***/

// TODO: error handling
export async function postToAuthTokenUrl(payload) {
    try {
        const body = new URLSearchParams(payload).toString();
        const url = process.env.UAA_ROOT_URL + process.env.UAA_TOKEN_PATH;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`an error occurred with response code ${response.status}`);
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

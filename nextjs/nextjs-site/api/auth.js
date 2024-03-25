/***/
// API library for auth requests
/***/
// TODO: error handling
export async function postToTokenUrlAndSetSession(payload) {
    const body = new URLSearchParams(payload).toString();
    const response = await fetch(process.env.UAA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
};

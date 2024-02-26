/***/
// API library for basic error handling and serialization
/***/

async function getData(url, token) {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            const data = await res.json();
            console.log("ERROR " + JSON.stringify(data));
            throw new Error(`an error occurred with response code ${res.status}`);
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getData };

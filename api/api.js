/***/
// API library for basic error handling and serialization
/***/

export async function addData(url, body, options = {}) {
  try {
    const reqOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    };
    const res = await fetch(url, reqOptions);
    if (res.ok || res.status == 422) {
      const json = await res.json();
      return json;
    } else {
      // note: if debugging cloudcoundry responses, it may be helpful
      // to check the res.json() contents here
      throw new Error(`an error occurred with response code ${res.status}`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteData(url, options = {}) {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      ...options,
    });
    if (res.ok) {
      return true;
    } else {
      throw new Error(`an error occurred with response code ${res.status}`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getData(url, options = {}) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      ...options,
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error(`an error occurred with response code ${res.status}`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

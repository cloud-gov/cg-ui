/***/
// API library for basic error handling and serialization
/***/

export async function request(url: string, options = {}): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function addData(
  url: string,
  body: any,
  options = {}
): Promise<object> {
  try {
    const reqOptions = {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    };
    const res = await fetch(url, reqOptions);
    if (res.ok || res.status == 422) {
      return await res.json();
    } else {
      throw new Error(`an error occurred with response code ${res.status}`);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteData(url: string, options = {}): Promise<boolean> {
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
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getData(url: string, options = {}): Promise<object> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      ...options,
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`an error occurred with response code ${res.status}`);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

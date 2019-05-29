const dispatch = async (url, options) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include'
    });
    if (res.status !== 200) {
      console.log('Response returned with status:', res.status);
      return res;
    }

    try {
      const data = await res.json();
      return data;
    } catch (e) {
      return await res.text();
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};

const send = (url, data, method) =>
  dispatch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const post = _.curry((url, data) => send(url, data, 'POST'));
export const put = _.curry((url, data) => send(url, data, 'PUT'));

export const get = url =>
  dispatch(url, {
    method: 'GET'
  });

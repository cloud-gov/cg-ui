import { addData } from '../../api/api';

export function SessionForm({ sessions, setSessionData }) {
  const addSession = async (formData) => {
    const username = formData.get('username');
    try {
      // TODO implement error handling
      if (!username) {
        return;
      }
      const res = await addData('/api/session', { username: username });
      if (!res) {
        return;
      }
      const item = res['rows'][0];
      setSessionData([...sessions, item]);
    } catch (error) {
      console.log('error with request: ' + error.message);
    }
  };

  return (
    <>
      <p>Add a new user session</p>

      <form action={addSession}>
        <label>
          <span>Username</span>
          <input type="text" name="username" required aria-label="username" />
        </label>
        <div>
          <button role="button" type="submit">
            Add username
          </button>
        </div>
      </form>
    </>
  );
}

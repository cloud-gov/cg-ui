import { addData } from '@api/api';

export function SessionForm({ sessions, setSessionData }) {
  const addSession = async (event) => {
    event.preventDefault();
    const username = event.currentTarget.elements.username.value;
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

      <form onSubmit={addSession} action="#">
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

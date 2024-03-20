import { addData } from "../../api/api";

export function SessionForm({ sessions, setSessionData }) {

  const addSession = async(formData) => {
    const username = formData.get("username")
    try {
      if (username) {
        const res = await addData("/api/session", { "username" : username })
        if (res) {
          const item = res["rows"][0];
          setSessionData([...sessions, item]);
        } else {
          console.log("oh no it didn't work");
        }
      } else {
        console.log("no username");
      }
    } catch (error) {
      console.log("error with request: " + error.message);
    }
  }

  return(
    <>
    <p>Add a new user session</p>

    <form action={addSession}>
      <label>
        <span>Username</span>
        <input type="text" name="username" required />
      </label>
      <div>
        <input type="submit" value="Add" />
      </div>
    </form>
    </>
  )
}

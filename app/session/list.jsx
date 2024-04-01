export function SessionList({ sessions }) {
  return(
    <>
      <h2>Active sessions</h2>

      <ul role='list'>{sessions.map(user => (
        <li role='listitem' key={user["id"]}>{user["username"]}</li>
      ))}</ul>
    </>
  )
}

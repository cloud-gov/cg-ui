import { viewSessions, addSession } from "../../../db/session.js";

export async function GET() {
  try {
    const rows = await viewSessions()
    return Response.json({
      "count" : rows.length,
      "rows" : rows
    })
  } catch (error) {
    return Response.json({
      "error" : error.message
    })
  }
}

export async function POST(request) {
  try {
    const res = await request.json()
    if (res && res.username) {
      await addSession(res.username);
      return Response.json({ "status" : "added username: " + res.username })
    } else {
      return Response.json({ "error" : "no username supplied" })
    }
  } catch (error) {
    return Response.json({
      "error" : error.message
    })
  }
}

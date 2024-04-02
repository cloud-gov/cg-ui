import { viewSessions, addSession } from '../../../db/session.js';

export async function GET() {
  try {
    const rows = await viewSessions();
    return Response.json({
      count: rows.length,
      rows: rows,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
    });
  }
}

export async function POST(request) {
  try {
    const req = await request.json();
    if (req && req.username) {
      const res = await addSession(req.username);
      return Response.json({
        count: 1,
        rows: [res],
      });
    } else {
      return Response.json({ error: 'no username supplied' });
    }
  } catch (error) {
    return Response.json({
      error: error.message,
    });
  }
}

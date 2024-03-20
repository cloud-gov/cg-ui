import { createSessionTable, deleteSessionTable } from "../../../db/session.js";

export async function GET() {
  try {
    const res = await createSessionTable();
    return Response.json({
      "status" : "success",
      "message" : res,
    })
  } catch (error) {
    return Response.json({
      "error" : error.message
    })
  }
}

export async function DELETE() {
  try {
    const res = await deleteSessionTable();
    return Response.json({
      "status" : "success",
      "message" : res,
    })
  } catch (error) {
    return Response.json({
      "error" : error.message
    })
  }
}

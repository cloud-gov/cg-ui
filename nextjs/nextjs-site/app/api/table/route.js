import { seed } from "../../../db/session.js";

export async function GET() {
  try {
    const res = await createTable();
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
    const res = await deleteTable();
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

import { addCFOrgRole } from '../../../../api/cloudfoundry';

export async function POST(request) {
  try {
    // TODO make this friendlier if there's a missing
    // org, role, user, etc
    const req = await request.json();
    const res = await addCFOrgRole({
      orgGuid: req.orgGuid,
      roleType: req.roleType,
      username: req.username,
    });

    // TODO do we want to do anything with the response
    // before sending it back?
    return Response.json(res);
  } catch (error) {
    return Response.json({
      error: `failed to add org role: ${error.message}`,
    });
  }
}

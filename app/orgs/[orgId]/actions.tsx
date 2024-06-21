import { ControllerResult } from '@/controllers/controller-types';
import { removeUserFromOrg } from '@/controllers/controllers';

export async function removeFromOrg(
  allSpaceRoleGuids: string[],
  allOrgRoleGuids: string[]
): Promise<ControllerResult> {
  return await removeUserFromOrg(allSpaceRoleGuids, allOrgRoleGuids);
}

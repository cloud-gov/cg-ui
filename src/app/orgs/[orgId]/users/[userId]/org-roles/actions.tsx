'use server';

import { revalidatePath } from 'next/cache';
import { addRole, deleteRole } from '@/api/cf/cloudfoundry';
import {
  pollForJobCompletion,
  logDevError,
} from '@/controllers/controller-helpers';

type RolesChangeset = {
  [role_type: string]: {
    type: string;
    selected: boolean;
    guid?: string;
  };
};

export async function updateOrgRolesForUser(
  orgGuid: string,
  userGuid: string,
  rolesChangeset: RolesChangeset
): Promise<boolean> {
  const responses = await Promise.all(
    Object.values(rolesChangeset).map((role) => {
      if (role.guid && !role.selected) {
        return deleteRole(role.guid);
      }
      if (!role.guid && role.selected) {
        return addRole({
          orgGuid: orgGuid,
          roleType: role.type,
          userGuid: userGuid,
        });
      }
    })
  );

  let jobLocations = responses.map((response) => {
    if (!response) return;
    if (!response.ok) {
      logDevError(
        `api error on cf edit org page with http code ${response.status} for url: ${response.url}`
      );
      throw new Error('Try submitting your changes again.');
    }
    return response.headers.get('Location');
  });
  jobLocations = jobLocations.filter((l) => !!l); // filter out the add role responses
  await Promise.all(jobLocations.map((loc) => pollForJobCompletion(loc)));

  if (process.env.NODE_ENV !== 'test') {
    revalidatePath('/roles');
  }
  return true; // because this is being returned from the server to a client component, the return value needs to be one of the following: https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values
}

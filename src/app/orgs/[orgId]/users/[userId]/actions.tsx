'use server';

import { revalidatePath } from 'next/cache';
import { addRole, deleteRole } from '@/api/cf/cloudfoundry';
import {
  pollForJobCompletion,
  logDevError,
} from '@/controllers/controller-helpers';
import { RolesState } from '@/controllers/controller-types';

export async function updateSpaceRolesForUser(
  userGuid: string,
  rolesState: RolesState
) {
  const responses = await Promise.all(
    Object.keys(rolesState)
      .map((spaceGuid) => {
        const rolesSet = rolesState[spaceGuid];
        return Object.values(rolesSet).map((role) => {
          if (role.guid && !role.selected) {
            return deleteRole(role.guid);
          }
          if (!role.guid && role.selected) {
            return addRole({
              spaceGuid: spaceGuid,
              roleType: role.type,
              userGuid: userGuid,
            });
          }
          return null;
        });
      })
      .flat()
      .filter((item) => !!item)
  );

  let jobLocations = responses.map((response) => {
    if (!response) return;
    if (!response.ok) {
      logDevError(
        `api error on cf edit spaces page with http code ${response.status} for url: ${response.url}`
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

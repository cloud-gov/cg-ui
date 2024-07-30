'use server';

import { revalidatePath } from 'next/cache';
import { addRole } from '@/api/cf/cloudfoundry';
import { RoleType } from '@/api/cf/cloudfoundry-types';
import { ControllerResult } from '@/controllers/controller-types';
import { emailIsValid } from '@/helpers/text';

function formatError(errMsg: string): string {
  return errMsg
    .replace("already has 'organization_user' role in", 'already belongs to')
    .replace('No user exists', 'No Cloud.gov account exists');
}

export async function addUserToOrg(formData: FormData) {
  const email = formData.get('add-user-to-org-form-email') as string;
  if (!email) {
    /* Because we're passing from server to client, we must stringify the data */
    return JSON.stringify({
      meta: {
        status: 'error',
        errors: ['No email found. Please enter a valid email and try again.'],
      },
    } as ControllerResult);
  }
  if (!emailIsValid(email)) {
    return JSON.stringify({
      meta: {
        status: 'error',
        errors: [
          'Email is missing an "@". Please enter a valid email and try again.',
        ],
      },
    } as ControllerResult);
  }
  const orgId = formData.get('add-user-to-org-form-org') as string;
  const res = await addRole({
    orgGuid: orgId,
    roleType: 'organization_user' as RoleType,
    username: email,
  });
  const resJson = await res.json();
  if (!res.ok) {
    return JSON.stringify({
      meta: {
        status: 'error',
        errors: resJson.errors.map((e: { detail: string }) =>
          formatError(e.detail || '')
        ),
      },
    } as ControllerResult);
  }
  if (process.env.NODE_ENV !== 'test') {
    revalidatePath('/roles');
  }
  return JSON.stringify({
    meta: { status: 'success' },
    payload: {
      userId: resJson.relationships.user.data.guid as string,
    },
  } as ControllerResult);
}

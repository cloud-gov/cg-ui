import {
  addOrgRole,
  deleteRole,
  deleteOrgUser,
} from '../../../../api/cf/cloudfoundry';

interface FormResponse {
  success: boolean;
  message: string;
}

export async function postData(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const res = await addOrgRole({
      orgGuid: formData.get('guid') as string,
      roleType: formData.get('org-role') as string,
      username: formData.get('email-username') as string,
    });
    if (res.errors.length == 0) {
      return { success: true, message: res.messages.join(', ') };
    } else {
      return { success: false, message: res.errors.join(', ') };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function removeRole(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const roleGuid = formData.get('roleGuid') as string;
    const res = await deleteRole(roleGuid);
    return { success: true, message: JSON.stringify(res) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function removeUser(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const orgGuid = formData.get('orgGuid') as string;
    const userGuid = formData.get('userGuid') as string;
    const res = await deleteOrgUser(orgGuid, userGuid);
    return { success: true, message: JSON.stringify(res) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

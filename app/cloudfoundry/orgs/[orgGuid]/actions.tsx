import {
  addOrgRole,
  deleteRole,
  deleteOrgUser,
} from '@controllers/controllers';
import { OrgRole } from '@api/cf/cloudfoundry';

interface FormResponse {
  success: boolean;
  message: string | undefined;
}

export async function postData(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const res = await addOrgRole({
      orgGuid: formData.get('guid') as string,
      roleType: formData.get('org-role') as OrgRole,
      username: formData.get('email-username') as string,
    });
    return { success: res.success, message: res.message };
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
    return { success: res.success, message: res.message };
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
    return { success: res.success, message: res.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

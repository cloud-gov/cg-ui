import {
  addSpaceRole,
  deleteRole,
  deleteSpaceUser,
} from '@/controllers/prototype-controller';
import { RoleType } from '@/api/cf/cloudfoundry-types';

interface FormResponse {
  success: boolean;
  message: string | undefined;
}

export async function postData(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const res = await addSpaceRole({
      spaceGuid: formData.get('space-guid') as string,
      roleType: formData.get('space-role') as RoleType,
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
    const spaceGuid = formData.get('spaceGuid') as string;
    const userGuid = formData.get('userGuid') as string;
    const res = await deleteSpaceUser(spaceGuid, userGuid);
    return { success: res.success, message: res.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

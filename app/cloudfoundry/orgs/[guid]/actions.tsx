import {
  addCFOrgRole,
  deleteCFOrgRole,
} from '../../../../api/cloudfoundry/cloudfoundry';

interface FormResponse {
  success: boolean;
  message: string;
}

export async function postData(
  prevState: any,
  formData: FormData
): Promise<FormResponse> {
  try {
    const res = await addCFOrgRole({
      orgGuid: formData.get('guid') as string,
      roleType: formData.get('org-role') as string,
      username: formData.get('email-username') as string,
    });
    // TODO this will need to detect if the response was returned
    // that indicates the action was not successful, like a cf error
    return { success: true, message: JSON.stringify(res) };
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
    const res = await deleteCFOrgRole(roleGuid);
    return { success: true, message: JSON.stringify(res) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

import { addCFOrgRole } from '../../../../api/cloudfoundry/cloudfoundry';

export async function postData(prevState: any, formData: FormData) {
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

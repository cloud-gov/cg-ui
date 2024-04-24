import { addCFOrgRole } from '../../../../api/cloudfoundry';

export async function postData(prevState: any, formData: FormData) {
  try {
    await addCFOrgRole({
      orgGuid: formData.get('guid') as string,
      roleType: formData.get('org-role') as string,
      username: formData.get('email-username') as string,
    });
    return { success: true, message: 'test message' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

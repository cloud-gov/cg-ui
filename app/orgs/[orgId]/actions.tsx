import { ControllerResult } from '@/controllers/controller-types';

export async function removeFromOrg(): Promise<ControllerResult> {
  // prevState: any,
  // formData: FormData,
  console.log('in server action');
  return new Promise((resolve) => {
    resolve({ meta: { status: 'error', errors: [] }, payload: {} });
  });
  /*
    on error: { meta: { status: 'error', errors: ['foo', 'bar'] }}

    on success: { meta: { status: 'success' }, payload: { userGuid: 'abc' }}
  */
}

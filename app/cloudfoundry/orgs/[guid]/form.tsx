'use client';

import { useFormState } from 'react-dom';
import { postData } from './actions';

export function UserAction({ orgGuid }: { orgGuid: string }) {
  const initialState = {
    success: false,
    message: '',
  };
  const [formState, formAction] = useFormState(postData, initialState);

  return (
    <>
      {formState.success && <div>Success: {formState.success}</div>}
      {formState.message && <div>Message: {formState.message}</div>}
      <form action={formAction} className="usa-form">
        <input type="hidden" value={orgGuid} id="guid" name="guid" />
        <label className="usa-label" htmlFor="email-username">
          Email
        </label>
        <input
          className="usa-input"
          id="email-username"
          name="email-username"
        />
        <label className="usa-label" htmlFor="org-role">
          Organization role
        </label>
        <select className="usa-select" name="org-role" id="org-role">
          <option>- Select -</option>
          <option value="organization_manager">Organization manager</option>
          <option value="organization_user">Organization user</option>
          <option value="organization_auditor">Organization auditor</option>
        </select>
        <div>
          <button className="usa-button" role="button" type="submit">
            Add user
          </button>
        </div>
      </form>
    </>
  );
}

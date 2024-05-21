'use client';

import { useFormState } from 'react-dom';
import { postData } from './actions';
import { Button } from '@/components/uswds/Button';

export function UserAction({ spaceGuid }: { spaceGuid: string }) {
  const initialState = {
    success: false,
    message: '',
  };
  const [formState, formAction] = useFormState(postData, initialState);

  return (
    <>
      {formState.message && <div>{formState.message}</div>}
      <form action={formAction} className="usa-form">
        <input
          type="hidden"
          value={spaceGuid}
          id="space-guid"
          name="space-guid"
        />
        <label className="usa-label" htmlFor="email-username">
          Email
        </label>
        <input
          className="usa-input"
          id="email-username"
          name="email-username"
        />
        <label className="usa-label" htmlFor="space-role">
          Space role
        </label>
        <select className="usa-select" name="space-role" id="space-role">
          <option>- Select -</option>
          <option value="space_manager">Space manager</option>
          <option value="space_developer">Space developer</option>
          <option value="space_auditor">Space auditor</option>
          <option value="space_supporter">Space supporter</option>
        </select>
        <div>
          <Button role="button" type="submit">
            Add user
          </Button>
        </div>
      </form>
    </>
  );
}

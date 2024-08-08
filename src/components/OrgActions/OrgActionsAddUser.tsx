'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/uswds/Button';
import { TextInput } from '@/components/uswds/TextInput';
import { addUserToOrg } from '@/app/orgs/[orgId]/users/add/actions';
import { Alert } from '@/components/uswds/Alert';

type ActionStatus = 'default' | 'pending' | 'success' | 'error';

export function OrgActionsAddUser({
  orgId,
  onCancelPath,
}: {
  orgId: string;
  onCancelPath?: string;
}) {
  const [actionStatus, setActionStatus] = useState<ActionStatus>(
    'default' as ActionStatus
  );
  const [actionErrors, setActionErrors] = useState<string[]>([] as string[]);
  const [userId, setUserId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const inviteUrl: string | undefined = process.env.NEXT_PUBLIC_USER_INVITE_URL;

  const onSubmit = async (formData: FormData) => {
    try {
      Promise.resolve()
        .then(() => {
          // set state first
          // I had to do this to get React to show the pending state before calling the form action
          setActionStatus('pending' as ActionStatus);
          setActionErrors([]);
          setUserId(null);
          setEmailInput(null);
        })
        .then(async () => {
          const response = await addUserToOrg(formData);
          const resObj = JSON.parse(response);
          if (resObj.meta?.status === 'error') {
            setActionStatus('error' as ActionStatus);
            setActionErrors(resObj.meta?.errors || []);
          }
          if (resObj.meta?.status === 'success') {
            const email = formData.get('add-user-to-org-form-email') as string;
            setUserId(resObj.payload.userId);
            setEmailInput(email);
            setActionStatus('success' as ActionStatus);
          }
        });
    } catch (e: any) {
      setActionStatus('error' as ActionStatus);
      setActionErrors([
        'Something went wrong with the request. Please try again.',
      ]);
    }
  };

  return (
    <form
      action={onSubmit}
      className="usa-form usa-form--large"
      name="add-user-to-org-form"
    >
      <p>
        The user must already have a Cloud.gov account.
        {inviteUrl && (
          <>
            {' '}
            If they don't, please invite them at{' '}
            <Link href={inviteUrl}>{inviteUrl}</Link>.
          </>
        )}
      </p>
      <p>
        Users are given the default role of <strong>User</strong>. You'll be
        able to manage their roles once they're added.
      </p>

      {actionStatus === 'error' && (
        <Alert type="error">{actionErrors.join(', ')}</Alert>
      )}
      {actionStatus === 'success' && (
        <Alert type="success">
          <strong>{emailInput || 'User'}</strong> has been added!
          {userId && (
            <>
              <br />
              <Link href={`/orgs/${orgId}/users/${userId}/org-roles`}>
                Manage their organization roles
              </Link>
            </>
          )}
        </Alert>
      )}

      <fieldset className="usa-fieldset">
        <legend className="usa-legend usa-sr-only">
          <strong>Enter an email address</strong>
        </legend>
        <TextInput
          required
          type="email"
          id="add-user-to-org-form-email"
          labelText="Email (required)"
        />
      </fieldset>
      <input type="hidden" name="add-user-to-org-form-org" value={orgId} />
      <div className="margin-top-3">
        {onCancelPath && (
          <Link
            href={onCancelPath}
            className="usa-button usa-button--unstyled margin-right-4"
          >
            Cancel
          </Link>
        )}
        <Button type="submit" disabled={actionStatus === 'pending'}>
          Add
        </Button>
        {actionStatus === 'pending' && <p>Submission in progress...</p>}
      </div>
    </form>
  );
}

'use client';

import React from 'react';
import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { ControllerResult, RolesState } from '@/controllers/controller-types';
import { defaultSpaceRoles } from '@/controllers/controller-helpers';
import { SpaceObj } from '@/api/cf/cloudfoundry-types';
import { useState, useEffect } from 'react';
import { GridList } from '@/components/GridList/GridList';
import { Button } from '@/components/uswds/Button';
import { RolesForSpace } from '@/components/UsersActions/UserActionsSpaceRoles/RolesForSpace';
import { Alert } from '@/components/uswds/Alert';
import { updateSpaceRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/actions';

type ActionStatus = 'default' | 'pending' | 'success' | 'error';

type SpacesPayload = Array<SpaceObj>;

export function UsersActionsSpaceRoles({
  orgGuid,
  userGuid,
}: {
  orgGuid: string;
  userGuid: string;
}) {
  const [spaces, setSpaces] = useState([] as SpacesPayload);
  const [roles, setRoles] = useState({} as RolesState);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingErrorMessage, setloadingErrorMessage] = useState(null);
  const [actionStatus, setActionStatus] = useState('default' as ActionStatus);
  const [formSubmitEnabled, setFormSubmitEnabled] = useState(false);
  const [actionErrors, setActionErrors] = useState([] as string[]);
  const isButtonDisabled: boolean =
    !formSubmitEnabled ||
    actionStatus === 'pending' ||
    actionStatus === 'success';
  const isFieldsetDisabled: boolean = actionStatus === 'pending';

  useEffect(() => {
    const fetchData = async () => {
      if (dataLoaded) return;
      try {
        const { payload } = await getOrgUserSpacesPage(orgGuid, userGuid);
        setDataLoaded(true);
        setFetchedDataToState(payload);
      } catch (e: any) {
        setloadingErrorMessage(e.message);
      }
    };
    fetchData();
  });

  const setFetchedDataToState = (payload: ControllerResult['payload']) => {
    setSpaces(payload.spaces as SpacesPayload);
    setRoles(payload.roles as RolesState);
  };

  const handleChange = (space: any, role: any) => {
    setActionStatus('default');
    const newState = JSON.parse(JSON.stringify(roles)); // cheap way to get a deep copy of an object
    if (roles[space.guid] === undefined) {
      newState[space.guid] = JSON.parse(JSON.stringify(defaultSpaceRoles));
      newState[space.guid][role.type]['selected'] = true;
    } else {
      newState[space.guid][role.type]['selected'] =
        !roles[space.guid][role.type]['selected'];
    }
    setRoles(newState);
    setFormSubmitEnabled(true);
  };

  const submitForm = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setActionStatus('pending' as ActionStatus);
    setActionErrors([]);
    try {
      await updateSpaceRolesForUser(userGuid, roles);
      const { meta, payload } = await getOrgUserSpacesPage(orgGuid, userGuid);
      if (meta.status === 'success') {
        setFetchedDataToState(payload);
        setActionStatus('success' as ActionStatus);
      }
      if (meta.status === 'error') {
        meta?.errors && setActionErrors(meta.errors);
        setActionStatus('error' as ActionStatus);
      }
    } catch (e: any) {
      setActionStatus('error' as ActionStatus);
      setActionErrors([e.message]);
    }
  };

  if (loadingErrorMessage) {
    return <Alert type="error">{loadingErrorMessage}</Alert>;
  }

  if (!dataLoaded) {
    return <p>Loading form...</p>;
  }
  return (
    <form onSubmit={submitForm}>
      {actionStatus === 'pending' && (
        <Alert type="warning">Submission in progress...</Alert>
      )}
      {actionStatus === 'success' && (
        <Alert type="success">Changes saved!</Alert>
      )}
      {actionStatus === 'error' && (
        <Alert type="error">{actionErrors.join(', ')}</Alert>
      )}
      <div className="tablet:display-flex flex-row flex-justify margin-bottom-3">
        <div className="flex-4 maxw-mobile-lg">
          <h2>Space roles</h2>
          <p className="margin-bottom-0">
            Optional. By assigning additional roles, you can grant access to
            space level information and features.
          </p>
        </div>
        <div className="align-self-end margin-top-2 tablet:margin-top-auto">
          <Button type="submit" disabled={isButtonDisabled}>
            Save changes
          </Button>
        </div>
      </div>
      <GridList>
        {spaces.map((space: any) => (
          <fieldset
            key={space.guid}
            disabled={isFieldsetDisabled}
            className="usa-fieldset"
          >
            <legend className="usa-legend usa-sr-only">
              <strong>Select roles for space: {space.name}</strong>
            </legend>
            <RolesForSpace
              space={space}
              roles={roles[space.guid] || defaultSpaceRoles}
              handleChange={handleChange}
            />
          </fieldset>
        ))}
      </GridList>
    </form>
  );
}

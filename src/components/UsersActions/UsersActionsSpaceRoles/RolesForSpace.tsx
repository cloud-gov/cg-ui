'use client';

import { SpaceObj } from '@/api/cf/cloudfoundry-types';
import { SpaceRoleMap } from '@/controllers/controller-types';
import { GridListItem } from '@/components/GridList/GridListItem';
import { Checkbox } from '@/components/uswds/Checkbox';

export function RolesForSpace({
  space,
  roles,
  handleChange,
}: {
  space: SpaceObj;
  roles: SpaceRoleMap;
  handleChange: Function;
}) {
  return (
    <GridListItem>
      <div className="grid-row users-actions-space-role">
        <div className="tablet-lg:grid-col-4 mobile-lg:padding-bottom-2 tablet-lg:padding-bottom-0">
          <strong>{space.name}</strong>
        </div>
        {Object.values(roles).map((role: any) => (
          <div
            className="mobile-lg:grid-col-6 tablet-lg:grid-col-2 tablet:padding-bottom-2 tablet-lg:padding-bottom-0"
            key={`space-${space.guid}-role-${role.type}`}
          >
            <Checkbox
              id={`${space.guid}-${role.type}`}
              name={space.guid}
              checked={role.selected}
              label={role.name}
              onChange={() => handleChange(space, role)}
            />
          </div>
        ))}
      </div>
    </GridListItem>
  );
}

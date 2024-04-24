import { CFUSerSpace } from './_interfaces';

export function UsersTableSpace({ space }: { space: CFUSerSpace }) {
  return (
    <div className="padding-x-2 margin-top-2 users-table-space">
      <div>
        <strong>{space.spaceName}:</strong>
      </div>
      <div>{space.roleName}</div>
    </div>
  );
}

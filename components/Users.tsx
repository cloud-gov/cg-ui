import React from 'react';
export interface OrgRoleProp {
  name: string;
}

export interface UserProp {
  name: string;
  // orgRoles: Array<OrgRoleProp>
}

export function Users({
  children,
  users,
}: {
  children?: React.ReactNode;
  users: Array<UserProp>;
}) {
  return (
    <>
      {users.map((user, i) => (
        <div key={i}>
          <h2>{user.name}</h2>
          {children}
        </div>
      ))}
    </>
  );
}

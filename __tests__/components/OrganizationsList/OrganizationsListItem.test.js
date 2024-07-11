/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { OrganizationsListItem } from '@/components/OrganizationsList/OrganizationsListItem';

const mockOrg = {
  guid: 'orgGuid',
  created_at: '2017-06-01T19:27:19Z',
  name: 'Org 1',
  suspended: false,
};

describe('AppsListItem', () => {
  it('when given app and space info, displays fields', () => {
    // act
    render(<OrganizationsListItem org={mockOrg} />);

    const manageUsersLink = screen.getByRole('link', { name: 'Manage users' });
    const viewAppsLink = screen.getByRole('link', {
      name: 'View applications',
    });

    expect(screen.getByText('Org 1')).toBeInTheDocument();
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
    expect(screen.getByText('Created: Jun 1, 2017')).toBeInTheDocument();
    expect(manageUsersLink).toHaveAttribute('href', '/orgs/orgGuid');
    expect(viewAppsLink).toHaveAttribute('href', '/orgs/orgGuid/apps');
  });
});

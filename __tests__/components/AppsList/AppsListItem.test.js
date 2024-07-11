/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { AppsListItem } from '@/components/AppsList/AppsListItem';

const mockApp = {
  guid: 'appGuid',
  created_at: '2017-06-01T19:27:19Z',
  name: 'App 1',
  state: 'STOPPED',
};

const mockSpace = {
  name: 'Space 1',
};

describe('AppsListItem', () => {
  it('when given app and space info, displays fields', () => {
    // act
    render(<AppsListItem app={mockApp} orgGuid="orgGuid" space={mockSpace} />);

    expect(screen.getByText('App 1')).toBeInTheDocument();
    expect(screen.getByText('Space: Space 1')).toBeInTheDocument();
    expect(screen.getByText('Created: Jun 1, 2017')).toBeInTheDocument();
  });

  it('when app name is empty, subs in placeholder for user', () => {
    // act
    const mockAppCopy = JSON.parse(JSON.stringify(mockApp));
    mockAppCopy.name = '';
    render(
      <AppsListItem app={mockAppCopy} orgGuid="orgGuid" space={mockSpace} />
    );

    expect(screen.getByText('Unnamed application')).toBeInTheDocument();
  });
});

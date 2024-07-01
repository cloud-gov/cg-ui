/**
 * @jest-environment jsdom
 */
import nock from 'nock';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import { UsersActionsOrgRoles } from '@/components/UsersActions/UsersActionsOrgRoles';
import { mockRolesFilteredByOrgAndUser } from '@/__tests__/api/mocks/roles';
import { getEditOrgRoles } from '@/controllers/controllers';
import { updateOrgRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/org-roles/actions';

const controllerSuccessResponse = {
  meta: { status: 'success' },
  payload: mockRolesFilteredByOrgAndUser,
};

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../controllers/controllers');
jest.mock('../../../app/orgs/[orgId]/users/[userId]/org-roles/actions');
/* eslint no-undef: "error" */

describe('UsersActionsOrgRoles', () => {
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    // https://github.com/nock/nock#memory-issues-with-jest
    nock.restore();
  });

  describe('checkboxes in form', () => {
    it('checkboxes can be checked/unchecked', async () => {
      // setup
      getEditOrgRoles.mockImplementation(() => controllerSuccessResponse);
      // render
      render(<UsersActionsOrgRoles />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/Billing manager/)).toBeInTheDocument()
      );
      // query
      const checkBox = screen.getByRole('checkbox', {
        name: /Billing manager/,
      });
      // expect
      expect(checkBox.checked).toEqual(false);

      // act - it checks a checkbox on click
      fireEvent.click(checkBox);
      // expect
      expect(checkBox.checked).toEqual(true);

      // act - it unchecks on subsequent click
      fireEvent.click(checkBox);
      // expect
      expect(checkBox.checked).toEqual(false);
    });
  });

  describe('when data fetch fails', () => {
    it('shows error message', async () => {
      // setup
      getEditOrgRoles.mockImplementation(() => {
        throw new Error('failed to fetch');
      });
      // render
      render(<UsersActionsOrgRoles />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/failed to fetch/)).toBeInTheDocument()
      );
    });
  });

  describe('when form submission succeeds', () => {
    it('shows success message', async () => {
      // setup
      getEditOrgRoles.mockImplementation(() => controllerSuccessResponse);
      updateOrgRolesForUser.mockImplementation(() => true);
      // render
      render(<UsersActionsOrgRoles />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/Billing manager/)).toBeInTheDocument()
      );
      // query
      const submitBtn = screen.getByText('Save');
      // act
      fireEvent.click(submitBtn);
      // expect a success message
      await waitFor(() =>
        expect(
          screen.getByText(/Org roles have been saved!/)
        ).toBeInTheDocument()
      );
    });
  });
});

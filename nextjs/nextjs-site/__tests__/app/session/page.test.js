/**
 * @jest-environment jsdom
 */
import {
  describe, expect, it
}                           from '@jest/globals';
import {
  act, render, screen
}                           from '@testing-library/react';
import userEvent            from '@testing-library/user-event'
import Page                 from '../../../app/session/page';
import { getData }          from '../../../api/api';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../api/api', () => ({
  addData: jest.fn(),
  getData: jest.fn()
}));
/* eslint no-undef: "error" */

const fakeSessions = {
  count: 2,
  rows: [
    { id: 1, username: "Test1" },
    { id: 2, username: "Test2" }
  ]
};

describe("session page", () => {
  it("renders the form and a list of sessions", async () => {
    getData.mockImplementation(() => { return fakeSessions; });

    render(<Page />);
    expect(getData).toHaveBeenCalled();
    expect(await screen.findByText('Sessions')).toBeInTheDocument();
    expect(
      await screen.findByText('Add a new user session')
    ).toBeInTheDocument();
    expect(await screen.findByText('Test1')).toBeInTheDocument();
    expect(await screen.findByText('Test2')).toBeInTheDocument();
  });

  // TODO we will need to change this when we implement error handling
  it("renders an empty list when the api response fails", async () => {
    getData.mockImplementation(() => { throw new Error("bad API response"); })

    render(<Page />);
    expect(getData).toHaveBeenCalled();

    expect(await screen.findByText('Sessions')).toBeInTheDocument();
    const list = document.querySelector('listitem');
    expect(list).toBeNull;
  });

  it.todo("updates the list when the form is submitted");
  // it("updates the list when the form is submitted", async () => {
  //   getData.mockImplementation(() => { return fakeSessions; });

  //   render (<Page />);

  //   const user = userEvent.setup();

  //   await act( async () => {
  //     const input = await screen.getByRole('textbox', { name: 'username' });
  //     await user.type(input, 'Test');

  //     const submit = await screen.getByText('Add username');
  //     await user.click(submit);

  //     // const list = document.querySelector('listitem');
  //     // expect(list).toHaveLength(1);
  //     expect(await screen.findByText('Test')).toBeInTheDocument();
  //   });
  // });

});

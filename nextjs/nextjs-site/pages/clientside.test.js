/**
 * @jest-environment jsdom
 */
import                      '@testing-library/jest-dom';
import React                from 'react';
import {
    act, render, screen,
}                           from '@testing-library/react';
import { Users }            from './clientside';
import userMocks            from '../api/mocks/users';
// initial mock setup; must be done before importing the real thing
jest.mock('../api/users', () => ({
    getUsers: jest.fn()
}));
import { getUsers }         from '../api/users';

describe('Clientside Users', () => {

    it('shows a loading indicator by default', async () => {
        // mock
        getUsers.mockImplementation(() => {
            return [{ name: 'Foo', id: 1 }];
        });
        // render
        render(<Users />);
        // assert initial state
        const loadingIndicator = screen.getByText('loading...');
        expect(loadingIndicator).toBeInTheDocument();
        // assert eventual load
        // TODO: shouldn't have to run this in order to bypass warnings?
        expect(
            await screen.findByText('Foo')
        ).toBeInTheDocument();
    });

    it('lists the users when api call succeeds', async () => {
        // mock
        getUsers.mockImplementation(() => {
            return [{ name: 'Foo', id: 1 }];
        });
        // render
        const component = render(<Users />);
        // assert
        expect(
            await screen.findByText('Foo')
        ).toBeInTheDocument();
    });

    it('renders an error if api call fails', async () => {
        // mock
        getUsers.mockImplementation(() => {
            throw new Error('an err occurred');
        });
        // render
        const component = render(<Users />);
        // assert
        expect(
            await screen.findByText('an err occurred')
        ).toBeInTheDocument();
    });
})

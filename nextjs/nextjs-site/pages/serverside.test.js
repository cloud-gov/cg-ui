/**
 * @jest-environment jsdom
 */
import {
    describe, expect, it
}                           from '@jest/globals';
import Serverside           from './serverside';
import { render, screen }   from '@testing-library/react';

describe('Serverside users', () => {
    it('renders the users on api success', () => {
        // render
        const users = [{ name: 'Foo', id: 1 }];
        render(<Serverside users={users} />);
        // assert
        const user = screen.getByText('Foo');
        expect(user).toBeInTheDocument();
    });

    it('shows an error on api failure', () => {
        // render
        const error = new Error('an error occurred');
        render(<Serverside error={error} />);
        // assert
        const errorMsg = screen.getByText('an error occurred');
        expect(errorMsg).toBeInTheDocument();
    });
});

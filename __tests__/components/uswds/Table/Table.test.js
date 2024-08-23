/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Table } from '@/components/uswds/Table/Table';
import { TableHead } from '@/components/uswds/Table/TableHead';
import { TableHeadCell } from '@/components/uswds/Table/TableHeadCell';
import { TableBody } from '@/components/uswds/Table/TableBody';
import { TableRow } from '@/components/uswds/Table/TableRow';
import { TableCell } from '@/components/uswds/Table/TableCell';

describe('<Table />', () => {
  it('has a caption', () => {
    render(
      <Table>
        <TableHead>
          <TableHeadCell data="foo header 1" />
          <TableHeadCell data="foo header 2" />
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>foo cell 1</TableCell>
            <TableCell>foo cell 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const caption = screen.getByRole('caption');
    expect(caption).toBeInTheDocument();
  });

  describe('when sorting', () => {
    it('reads columns as sorted/unsorted with active styling', () => {
      render(
        <Table>
          <TableHead>
            <TableHeadCell data="foo header 1" sortDir="asc" />
            <TableHeadCell data="foo header 2" />
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sort={true}>foo cell 1</TableCell>
              <TableCell>foo cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      // sorted column reads as sorted
      const activeHeaderCell = screen.getByLabelText(
        /foo header 1, sortable column, currently sorted ascending/,
        { selector: 'th' }
      );
      // unsorted column reads as unsorted
      screen.getByLabelText(
        /foo header 2, sortable column, currently unsorted/,
        { selector: 'th' }
      );

      const activeDataCell = screen.getAllByRole('cell')[0];

      // sorted column has active styling
      expect(activeHeaderCell.classList.contains('active')).toBe(true);
      expect(activeDataCell.classList.contains('active')).toBe(true);
    });
  });

  describe('with a rowheader', () => {
    it('returns a th with rowheader role', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell rowheader={true}>foo cell 1</TableCell>
              <TableCell>foo cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const rowHeader = screen.getByRole('rowheader');
      expect(rowHeader).toBeInTheDocument();
    });
  });
});

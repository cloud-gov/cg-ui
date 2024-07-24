'use client';

import { TextInput } from '@/components/uswds/TextInput';
import { Button } from '@/components/uswds/Button';
import { SyntheticEvent } from 'react';

export function ListSearchInput({
  onSubmit,
  btnText = 'Search',
}: {
  onSubmit: Function;
  btnText?: string;
}) {
  const action = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get('list-search-field');
    onSubmit(inputValue);
  };
  return (
    <div className="margin-bottom-2">
      <form
        name="list-search-form"
        className="usa-search usa-search--small"
        role="search"
        onSubmit={action}
      >
        <label className="usa-sr-only" htmlFor="list-search-field">
          {btnText}
        </label>
        <TextInput type="search" id="list-search-field" />
        <Button type="submit">{btnText}</Button>
      </form>
    </div>
  );
}

'use client';

import { TextInput } from '@/components/uswds/TextInput';
import { Button } from '@/components/uswds/Button';
import { SyntheticEvent } from 'react';

export function ListSearchInput({
  onSubmit,
  btnText = 'Search',
  labelText,
}: {
  onSubmit: Function;
  btnText?: string;
  labelText?: string;
}) {
  const action = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get('list-search-field');
    onSubmit(inputValue || '');
  };
  return (
    <div className="margin-bottom-2">
      <label className="text-bold" htmlFor="list-search-field">
        {labelText || btnText}
      </label>
      <form
        name="list-search-form"
        className="usa-search usa-search--small margin-top-1"
        role="search"
        onSubmit={action}
      >
        <TextInput type="search" id="list-search-field" />
        <Button type="submit">{btnText}</Button>
      </form>
    </div>
  );
}

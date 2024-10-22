import { createContext } from 'react';

export const SRAnnounceContext = createContext({
  // eslint-disable-next-line no-unused-vars
  srAnnounce: (message: string): void => {},
});

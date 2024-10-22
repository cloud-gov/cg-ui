'use client';

/*
Testing out how to use React Context API for screen reader announcements:
Ideally, Parent component is most top-level client-rendered component on a page
(Context only works with client components)
and any Child component could trigger an announcement.
*/

import { SRAnnounceContext } from '@/contexts/SRAnnounceContext';
import { useContext, useState } from 'react';

function Parent({ children }: { children: any }) {
  const [successMsg, setSuccessMsg] = useState('');

  const srAnnounce = (message: any) => {
    console.log('clicked');
    setSuccessMsg(message);
  };

  return (
    <div>
      Here's a bunch of other content over the success message
      <div
        role="region"
        aria-live="assertive"
        aria-atomic={true}
        className="usa-sr-only"
      >
        {successMsg}
      </div>
      Parent:
      <SRAnnounceContext.Provider value={{ srAnnounce }}>
        {children}
      </SRAnnounceContext.Provider>
    </div>
  );
}

function Child() {
  const { srAnnounce } = useContext(SRAnnounceContext);
  const [count, setCount] = useState(0);

  const onclick = () => {
    setCount(count + 1);
    srAnnounce(`${count} woohoo, this is a success message!`);
  };

  return (
    <>
      Child:
      <button onClick={() => onclick()}>click me</button>
    </>
  );
}

export default function AnnouncePage() {
  return (
    <Parent>
      <Child />
    </Parent>
  );
}

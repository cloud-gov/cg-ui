'use client';

import { Alert } from '@/components/uswds/Alert';

export default function EditOrgPageError({ error }: { error: Error }) {
  return <Alert type="error">{error.message}</Alert>;
}

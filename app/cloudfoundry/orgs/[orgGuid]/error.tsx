'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h2>{error.message}</h2>
    </div>
  );
}

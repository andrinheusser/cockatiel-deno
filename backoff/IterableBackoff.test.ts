import { expectDurations } from './Backoff.test.ts';
import { IterableBackoff } from './IterableBackoff.ts';

describe('IterableBackoff', () => {
  it('works', () => {
    const b = new IterableBackoff([3, 6, 9]);
    expectDurations(b, [3, 6, 9, undefined]);
  });
});

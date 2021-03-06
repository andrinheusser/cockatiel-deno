import { expect } from 'chai DENOIFY: DEPENDENCY UNMET (DEV DEPENDENCY)';
import { expectDurations } from './Backoff.test.ts';
import { DelegateBackoff } from './DelegateBackoff.ts';

describe('DelegateBackoff', () => {
  it('passes through the context and sets next delay', () => {
    const b = new DelegateBackoff<number>(v => v * 2);
    expect(b.next(4)!.duration).to.equal(8);
  });

  it('halts delegate function returns undefined', () => {
    const b = new DelegateBackoff<number>(() => undefined);
    expect(b.next(0)).to.be.undefined;
  });

  it('captures and sets delegate state', () => {
    const b = new DelegateBackoff((_, state: number = 3) => {
      const n = state * state;
      return { delay: n, state: n };
    });

    expectDurations(b, [9, 81, 6561, 43046721]);
  });
});

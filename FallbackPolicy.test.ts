import { expect } from 'chai DENOIFY: DEPENDENCY UNMET (DEV DEPENDENCY)';
import { stub } from 'sinon DENOIFY: DEPENDENCY UNMET (DEV DEPENDENCY)';
import { CancellationTokenSource } from './CancellationToken.ts';
import { Policy } from './Policy.ts';

describe('FallbackPolicy', () => {
  it('does not fall back when not necessary', async () => {
    const result = await Policy.handleAll()
      .fallback('error')
      .execute(() => 'ok');
    expect(result).to.equal('ok');
  });

  it('returns a fallback and emits an error if necessary', async () => {
    const policy = await Policy.handleAll().fallback('error');
    const onFallback = stub();
    policy.onFailure(onFallback);

    const error = new Error('oh no!');
    const result = await policy.execute(() => {
      throw error;
    });
    expect(result).to.equal('error');
    expect(onFallback).calledWith({
      reason: { error },
      handled: true,
      duration: onFallback.args[0]?.[0].duration,
    });
  });

  it('links parent cancellation token', async () => {
    const parent = new CancellationTokenSource();
    await Policy.handleAll()
      .fallback('error')
      .execute(({ cancellationToken }) => {
        expect(cancellationToken.isCancellationRequested).to.be.false;
        parent.cancel();
        expect(cancellationToken.isCancellationRequested).to.be.true;
      }, parent.token);
  });
});

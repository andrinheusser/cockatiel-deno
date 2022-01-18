import { CancellationToken } from './CancellationToken.ts';
import { ExecuteWrapper, returnOrThrow } from './common/Executor.ts';
import { IDefaultPolicyContext, IPolicy } from './Policy.ts';

/**
 * A no-op policy, useful for unit tests and stubs.
 */
export class NoopPolicy implements IPolicy {
  private readonly executor = new ExecuteWrapper();

  // tslint:disable-next-line: member-ordering
  public readonly onSuccess = this.executor.onSuccess;

  // tslint:disable-next-line: member-ordering
  public readonly onFailure = this.executor.onFailure;

  public async execute<T>(
    fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,
    cancellationToken = CancellationToken.None,
  ): Promise<T> {
    return returnOrThrow(await this.executor.invoke(fn, { cancellationToken }));
  }
}

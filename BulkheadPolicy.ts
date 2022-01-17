import { neverAbortedSignal } from './common/abort.ts';
import { defer } from './common/defer.ts';
import { EventEmitter } from './common/Event.ts';
import { ExecuteWrapper } from './common/Executor.ts';
import { BulkheadRejectedError } from './errors/BulkheadRejectedError.ts';
import { TaskCancelledError } from './errors/Errors.ts';
import { IDefaultPolicyContext, IPolicy } from './Policy.ts';

interface IQueueItem<T> {
  signal: AbortSignal;
  fn(context: IDefaultPolicyContext): Promise<T> | T;
  resolve(value: T): void;
  reject(error: Error): void;
}

/**
 * Bulkhead limits concurrent requests made.
 */
export class BulkheadPolicy implements IPolicy {
  private active = 0;
  private readonly queue: Array<IQueueItem<unknown>> = [];
  private readonly onRejectEmitter = new EventEmitter<void>();
  private readonly executor = new ExecuteWrapper();

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: member-ordering
  public readonly onSuccess = this.executor.onSuccess;

  /**
   * @inheritdoc
   */
  // tslint:disable-next-line: member-ordering
  public readonly onFailure = this.executor.onFailure;

  /**
   * Emitter that fires when an item is rejected from the bulkhead.
   */
  // tslint:disable-next-line: member-ordering
  public readonly onReject = this.onRejectEmitter.addListener;

  /**
   * Returns the number of available execution slots at this point in time.
   */
  public get executionSlots() {
    return this.capacity - this.active;
  }

  /**
   * Returns the number of queue slots at this point in time.
   */
  public get queueSlots() {
    return this.queueCapacity - this.queue.length;
  }

  constructor(private readonly capacity: number, private readonly queueCapacity: number) {}

  /**
   * Executes the given function.
   * @param fn Function to execute
   * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded
   */
  public async execute<T>(
    fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T,
    signal = neverAbortedSignal,
  ): Promise<T> {
    if (signal.aborted) {
      throw new TaskCancelledError();
    }

    if (this.active < this.capacity) {
      this.active++;
      try {
        return await fn({ signal });
      } finally {
        this.active--;
        this.dequeue();
      }
    }

    if (this.queue.length < this.queueCapacity) {
      const { resolve, reject, promise } = defer<T>();
      this.queue.push({ signal, fn, resolve, reject });
      return promise;
    }

    this.onRejectEmitter.emit();
    throw new BulkheadRejectedError(this.capacity, this.queueCapacity);
  }

  private dequeue() {
    const item = this.queue.shift();
    if (!item) {
      return;
    }

    Promise.resolve()
      .then(() => this.execute(item.fn, item.signal))
      .then(item.resolve)
      .catch(item.reject);
  }
}

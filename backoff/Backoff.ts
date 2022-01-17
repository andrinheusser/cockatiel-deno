/**
 * A generic type that returns backoff intervals.
 */
export interface IBackoffFactory<T> {
  /**
   * Returns the first backoff duration. Can return "undefined" to signal
   * that we should not back off.
   */
  next(context: T): IBackoff<T> | undefined;
}

/**
 * A generic type that returns backoff intervals.
 */
export interface IBackoff<T> extends IBackoffFactory<T> {
  /**
   * Returns the number of milliseconds to wait for this backoff attempt.
   */
  readonly duration: number;
}

export * from './CompositeBackoff.ts';
export * from './ConstantBackoff.ts';
export * from './DelegateBackoff.ts';
export * from './ExponentialBackoff.ts';
export * from './ExponentialBackoffGenerators.ts';
export * from './IterableBackoff.ts';

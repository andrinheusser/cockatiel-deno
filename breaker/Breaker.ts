import { CircuitState } from '../CircuitBreakerPolicy.ts';

/**
 * The breaker determines when the circuit breaker should open.
 */
export interface IBreaker {
  /**
   * Called when a call succeeds.
   */
  success(state: CircuitState): void;

  /**
   * Called when a call fails. Returns true if the circuit should open.
   */
  failure(state: CircuitState): boolean;
}

export * from './SamplingBreaker.ts';
export * from './ConsecutiveBreaker.ts';

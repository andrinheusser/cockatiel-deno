import { BrokenCircuitError } from './BrokenCircuitError.ts';
import { BulkheadRejectedError } from './BulkheadRejectedError.ts';
import { IsolatedCircuitError } from './IsolatedCircuitError.ts';
import { TaskCancelledError } from './TaskCancelledError.ts';

export * from './BrokenCircuitError.ts';
export * from './BulkheadRejectedError.ts';
export * from './IsolatedCircuitError.ts';
export * from './TaskCancelledError.ts';

export const isBrokenCircuitError = (e: unknown): e is BrokenCircuitError =>
  !!e && e instanceof Error && 'isBrokenCircuitError' in e;

export const isBulkheadRejectedError = (e: unknown): e is BulkheadRejectedError =>
  !!e && e instanceof Error && 'isBulkheadRejectedError' in e;

export const isIsolatedCircuitError = (e: unknown): e is IsolatedCircuitError =>
  !!e && e instanceof Error && 'isBulkheadRejectedError' in e;

export const isTaskCancelledError = (e: unknown): e is TaskCancelledError =>
  !!e && e instanceof Error && 'isBulkheadRejectedError' in e;

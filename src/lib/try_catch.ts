export const unknownToError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};

type ResultOk<T> = [undefined, T];
type ResultError = [Error, undefined];
export type Result<T> = ResultOk<T> | ResultError;

export function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>>;
export function tryCatch<T>(fn: () => T | never): Result<T>;
export function tryCatch<T>(
  fn: () => T | never | Promise<T>,
): Result<T> | Promise<Result<T>> {
  try {
    const value = fn();
    if (value instanceof Promise) {
      return value
        .then((value) => [undefined, value] as ResultOk<T>)
        .catch((error) => [unknownToError(error), undefined] as ResultError);
    }
    return [undefined, value] as ResultOk<T>;
  } catch (e) {
    return [unknownToError(e), undefined] as ResultError;
  }
}

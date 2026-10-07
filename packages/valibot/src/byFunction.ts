import * as v from 'valibot';

/**
 * Lazy schema evaluator function returning the schema produced by the given factory.
 *
 * @template | {@linkcode v.BaseSchema} `T` - Output schema type extending type
 *   {@linkcode v.BaseSchema}.
 *
 * @param fn - Factory function producing the schema.
 *
 * @returns The resolved schema instance of type `T`.
 *
 * @see -- type {@linkcode v.BaseIssue}
 */
export const byFunction = <
  const T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>,
>(
  fn: () => T,
) => fn();

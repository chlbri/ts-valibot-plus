import * as v from 'valibot';

/**
 * Wraps a Valibot schema into a union accepting either a single value or an array of
 * values.
 *
 * @template | {@linkcode v.BaseSchema} `T` - Item schema type extending type
 *   {@linkcode v.BaseSchema}.
 *
 * @param type - Target schema of type `T` to accept as a single element or an array.
 *
 * @returns A union schema accepting either an array of type `T` or a single value of
 *   type `T`.
 *
 * @see {@linkcode v.union}, {@linkcode v.array}
 */
export const soa = <const T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>>(
  type: T,
) => {
  return v.union([v.array(type), type]);
};

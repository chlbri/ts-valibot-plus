import * as v from 'valibot';

/**
 * Utility type resolving to either `T` or its type {@linkcode Readonly} counterpart.
 *
 * @template T - Wrapped value type.
 */
type MaybeReadonly<T> = T | Readonly<T>;

/**
 * Subset of type {@linkcode v.BaseSchema} that can be structurally rebuilt by
 * {@linkcode deepPartial}.
 *
 * Schemas of type {@linkcode v.SchemaWithPipe}, {@linkcode v.SchemaWithPipeAsync},
 * {@linkcode v.CustomSchema} and {@linkcode v.CustomSchemaAsync} are excluded because
 * their internal structure cannot be introspected.
 */
type Base = Exclude<
  v.BaseSchema<any, any, any>,
  | v.SchemaWithPipe<any>
  | v.SchemaWithPipeAsync<any>
  | v.CustomSchema<any, any>
  | v.CustomSchemaAsync<any, any>
>;

/** Object entry map linking each entry key to its schema of type {@linkcode Base}. */
type Entries = Record<string, Base>;

/**
 * Union of the polymorphic schema kinds accepted by {@linkcode deepPartial}.
 *
 * Covers object, strict object, tuple and array schemas of type
 * {@linkcode v.ObjectSchema}, {@linkcode v.StrictObjectSchema},
 * {@linkcode v.TupleSchema} and {@linkcode v.ArraySchema}.
 */
type CanPartial =
  | v.ObjectSchema<Entries, any>
  | v.StrictObjectSchema<Entries, any>
  | v.TupleSchema<MaybeReadonly<Base[]>, any>
  | v.ArraySchema<Base, any>;

/**
 * Recursive deep partial type for objects and arrays.
 *
 * Functions are preserved, arrays and tuples are delegated to type
 * {@linkcode _DeepPartialArray}, and objects to type
 * {@linkcode _DeepPartialObject}.
 *
 * @template T - The target type to make deeply partial.
 */
export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly unknown[]
    ? _DeepPartialArray<T>
    : T extends object
      ? _DeepPartialObject<T>
      : T;

/**
 * Internal recursive type helper for deep partial arrays and tuples.
 *
 * Each element is mapped through type {@linkcode DeepPartial}, and the whole array
 * type is reduced instead of inferring a single element type, so tuples keep their
 * length, element order and readonly modifiers rather than being widened to a
 * homogeneous array.
 *
 * @template T - Array or tuple structure type.
 */
export type _DeepPartialArray<T extends readonly unknown[]> =
  number extends T['length']
    ? DeepPartial<T[number]>[]
    : { [K in keyof T]: DeepPartial<T[K]> };

/**
 * Internal recursive type helper for deep partial objects.
 *
 * Every property becomes optional and is mapped through type {@linkcode DeepPartial}.
 *
 * @template T - Object structure type.
 */
export type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Type definition for a deeply partial Valibot schema.
 *
 * @template | {@linkcode CanPartial} `TSchema` - The input schema to convert.
 */
export type DeepPartialSchema<TSchema extends CanPartial> = v.BaseSchema<
  DeepPartial<v.InferInput<TSchema>>,
  DeepPartial<v.InferOutput<TSchema>>,
  v.BaseIssue<unknown>
>;

/**
 * Recursively converts a Valibot object, tuple or array schema of type
 * {@linkcode CanPartial} into a deep partial schema.
 *
 * Object schemas become strict objects with every entry optional and recursively
 * transformed, while arrays and tuples recurse into their items. Any other schema is
 * returned unchanged.
 *
 * @template | {@linkcode CanPartial} `TSchema` - The base schema to convert.
 *
 * @param schema - Target schema of type `TSchema` to transform.
 *
 * @returns A new deeply optional schema of type {@linkcode DeepPartialSchema}.
 *
 * @see -- type {@linkcode DeepPartial}
 */
export const deepPartial = <const TSchema extends CanPartial>(
  schema: TSchema,
): DeepPartialSchema<TSchema> => {
  // If it's an array, apply deepPartial to its item schema
  if (schema.type === 'array') {
    return v.array(deepPartial(schema.item as any)) as any;
  }

  // If it's an tuple, apply deepPartial to all items
  if (schema.type === 'tuple') {
    const items = schema.items.map(deepPartial as any) as any;
    return v.strictTuple(items) as any;
  }

  // If it's an object, make all its keys optional and recursive
  if (schema.type === 'object' || schema.type === 'strict_object') {
    const newEntries: Record<string, any> = {};
    for (const [key, value] of Object.entries(schema.entries)) {
      newEntries[key] = deepPartial(value as any);
    }

    return v.partial(v.strictObject(newEntries)) as any;
  }

  // For primitive types (string, number, etc.), return the schema as is
  return schema as any;
};

import * as v from 'valibot';

type MaybeReadonly<T> = T | Readonly<T>;

type Base = Exclude<
  v.BaseSchema<any, any, any>,
  | v.SchemaWithPipe<any>
  | v.SchemaWithPipeAsync<any>
  | v.CustomSchema<any, any>
  | v.CustomSchemaAsync<any, any>
>;

type Entries = Record<string, Base>;

type CanPartial =
  | v.ObjectSchema<Entries, any>
  | v.StrictObjectSchema<Entries, any>
  | v.TupleSchema<MaybeReadonly<Base[]>, any>
  | v.ArraySchema<Base, any>;

/**
 * Recursive deep partial type for objects and arrays.
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
 * The whole array type is reduced instead of inferring a single element type, so
 * tuples keep their length, element order and readonly modifiers rather than being
 * widened to a homogeneous array.
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
 * @template T - Object structure type.
 */
export type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Type definition for a deeply partial Valibot schema.
 *
 * @template | {@linkcode v.BaseSchema} `TSchema` - The input schema to convert.
 */
export type DeepPartialSchema<TSchema extends CanPartial> = v.BaseSchema<
  DeepPartial<v.InferInput<TSchema>>,
  DeepPartial<v.InferOutput<TSchema>>,
  v.BaseIssue<unknown>
>;

/**
 * Recursively converts a Valibot object or array schema into a deep partial schema.
 *
 * @template | {@linkcode v.BaseSchema} `TSchema` - The base schema to convert.
 *
 * @param schema - Target schema to transform.
 *
 * @returns A new deeply optional schema of type {@linkcode DeepPartialSchema}.
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

import { deepPartial, type DeepPartial } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('types', () => {
  const baseSchema = v.object({
    name: v.string(),
    age: v.number(),
    nested: v.object({ tag: v.string() }),
    tags: v.array(v.string()),
  });

  const partialSchema = deepPartial(baseSchema);

  test('#01 => DeepPartial makes keys optional recursively', () => {
    type Target = {
      a: string;
      nested: { b: number; deep: { c: boolean } };
      list: string[];
    };
    expectTypeOf<DeepPartial<Target>>().toEqualTypeOf<{
      a?: string;
      nested?: { b?: number; deep?: { c?: boolean } };
      list?: string[] | undefined;
    }>();
  });

  test('#02 => partial schema output matches the deep partial input', () => {
    expectTypeOf<v.InferOutput<typeof partialSchema>>().toEqualTypeOf<
      DeepPartial<v.InferOutput<typeof baseSchema>>
    >();
  });

  test('#03 => accepts empty, subset and nested partial inputs', () => {
    expect(v.parse(partialSchema, {})).toStrictEqual({});
    expect(v.parse(partialSchema, { name: 'bemedev' })).toStrictEqual({
      name: 'bemedev',
    });
    expect(v.parse(partialSchema, { nested: {} })).toStrictEqual({ nested: {} });
  });

  test('#04 = >makes every entry optional, recursively', () => {
    const entries = (partialSchema as any).entries;
    expect(entries.name.type).toBe('optional');
    expect(entries.age.type).toBe('optional');
    expect(entries.nested.type).toBe('optional');
  });

  test('#05 => still rejects wrong primitive types', () => {
    expect(() => v.parse(partialSchema, { age: 'not-a-number' })).toThrow();
  });
});

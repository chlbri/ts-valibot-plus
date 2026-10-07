import { byFunction } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('types', () => {
  test('#01 => infers the exact schema type returned by the factory', () => {
    const schema = byFunction(() => v.string());
    expectTypeOf(schema).toEqualTypeOf<v.StringSchema<undefined>>();
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string>();
  });

  test('#02 => keeps object schemas usable with valibot parsing', () => {
    const schema = byFunction(() => v.object({ name: v.string() }));
    const parsed = v.parse(schema, { name: 'bemedev' });
    expect(parsed).toStrictEqual({ name: 'bemedev' });
    expectTypeOf(parsed).toEqualTypeOf<{ name: string }>();
  });

  test('#03 => returns the exact instance produced by the factory', () => {
    const produced = v.number();
    const schema = byFunction(() => produced);
    expect(schema).toBe(produced);
  });

  test('#04 => still rejects values not matching the produced schema', () => {
    const schema = byFunction(() => v.number());
    expect(() => v.parse(schema, 'not-a-number')).toThrow();
  });
});

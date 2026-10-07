import { soa } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('types', () => {
  const stringSchema = soa(v.string());

  test('#01 => union output covers a single value and an array', () => {
    expectTypeOf<v.InferOutput<typeof stringSchema>>().toEqualTypeOf<
      string | string[]
    >();
  });

  test('#02 => accepts a single value or an array of values', () => {
    expect(v.parse(stringSchema, 'hello')).toBe('hello');
    expect(v.parse(stringSchema, ['a', 'b'])).toStrictEqual(['a', 'b']);
    expectTypeOf(v.parse(stringSchema, 'hello')).toEqualTypeOf<string | string[]>();
  });

  test('#03 => rejects values of the wrong type', () => {
    expect(() => v.parse(stringSchema, 123)).toThrow();
    expect(() => v.parse(stringSchema, ['ok', 123])).toThrow();
  });

  test('#04 => produces a union of the array and item schemas', () => {
    const union = stringSchema as any;
    expect(union.type).toBe('union');
    expect(union.options[0].type).toBe('array');
    expect(union.options[1].type).toBe('string');
  });
});

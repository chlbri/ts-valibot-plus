import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { soa } from '@bemedev/valibot';
import * as v from 'valibot';

describe('soa', () => {
  const { acceptation, success } = createTests(soa, {
    transform: (schema: any) => schema?.type,
  });

  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'wraps a string schema into a union',
        parameters: [v.string()],
        expected: 'union',
      },
      {
        invite: 'wraps a number schema into a union',
        parameters: [v.number()],
        expected: 'union',
      },
      {
        invite: 'wraps an object schema into a union',
        parameters: [v.object({ name: v.string() })],
        expected: 'union',
      },
    ),
  );

  describe('types', () => {
    test('union output covers single value and array', () => {
      const schema = soa(v.string());
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<
        string | string[]
      >();
    });

    test('accepts a single value or an array of values', () => {
      const schema = soa(v.string());
      expect(v.parse(schema, 'hello')).toBe('hello');
      expect(v.parse(schema, ['a', 'b'])).toStrictEqual(['a', 'b']);
      expectTypeOf(v.parse(schema, 'hello')).toEqualTypeOf<string | string[]>();
    });

    test('rejects values of the wrong type', () => {
      const schema = soa(v.string());
      expect(() => v.parse(schema, 123)).toThrow();
      expect(() => v.parse(schema, ['ok', 123])).toThrow();
    });
  });
});

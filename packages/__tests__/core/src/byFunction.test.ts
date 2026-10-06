import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { byFunction } from '@bemedev/valibot';
import * as v from 'valibot';

describe('byFunction', () => {
  const { acceptation, success } = createTests(byFunction, {
    transform: (schema: any) => schema?.type,
  });

  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'returns the string schema produced by the factory',
        parameters: [() => v.string()],
        expected: 'string',
      },
      {
        invite: 'returns the number schema produced by the factory',
        parameters: [() => v.number()],
        expected: 'number',
      },
      {
        invite: 'returns the object schema produced by the factory',
        parameters: [() => v.object({ name: v.string() })],
        expected: 'object',
      },
    ),
  );

  describe('types', () => {
    test('infers the exact schema type returned by the factory', () => {
      const schema = byFunction(() => v.string());
      expectTypeOf(schema).toEqualTypeOf<v.StringSchema<undefined>>();
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string>();
    });

    test('keeps object schemas usable with valibot parsing', () => {
      const schema = byFunction(() => v.object({ name: v.string() }));
      const parsed = v.parse(schema, { name: 'bemedev' });
      expect(parsed).toStrictEqual({ name: 'bemedev' });
      expectTypeOf(parsed).toEqualTypeOf<{ name: string }>();
    });
  });
});

import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { deepPartial, type DeepPartial } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('deepPartial', () => {
  const baseSchema = v.object({
    name: v.string(),
    age: v.number(),
    nested: v.object({ tag: v.string() }),
    tags: v.array(v.string()),
  });

  const partialSchema = deepPartial(baseSchema);

  const { acceptation, success } = createTests(deepPartial, {
    transform: (schema: any) => schema?.type,
  });

  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'converts an object schema (stays an object)',
        parameters: [v.object({ a: v.string() })],
        expected: 'object',
      },
      {
        invite: 'converts an array schema (stays an array)',
        parameters: [v.array(v.string())],
        expected: 'array',
      },
      {
        invite: 'leaves primitive schemas untouched',
        parameters: [v.string()],
        expected: 'string',
      },
    ),
  );

  describe('types', () => {
    test('DeepPartial makes keys optional recursively', () => {
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

    test('partial schema output matches the deep partial input', () => {
      expectTypeOf<v.InferOutput<typeof partialSchema>>().toEqualTypeOf<
        DeepPartial<v.InferOutput<typeof baseSchema>>
      >();
    });

    test('accepts empty, subset and nested partial inputs', () => {
      expect(v.parse(partialSchema, {})).toStrictEqual({});
      expect(v.parse(partialSchema, { name: 'bemedev' })).toStrictEqual({
        name: 'bemedev',
      });
      expect(v.parse(partialSchema, { nested: {} })).toStrictEqual({ nested: {} });
    });

    test('makes every entry optional, recursively', () => {
      const entries = (partialSchema as any).entries;
      expect(entries.name.type).toBe('optional');
      expect(entries.age.type).toBe('optional');
      expect(entries.nested.type).toBe('optional');
    });

    test('still rejects wrong primitive types', () => {
      expect(() => v.parse(partialSchema, { age: 'not-a-number' })).toThrow();
    });
  });
});

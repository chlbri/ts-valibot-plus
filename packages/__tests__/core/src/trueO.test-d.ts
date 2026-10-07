import { trueO } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('types', () => {
  test('#01 => accepts a raw unknown input', () => {
    expectTypeOf<v.InferInput<typeof trueO>>().toEqualTypeOf<unknown>();
  });

  test('#02 => infers a record of any values as output', () => {
    type Output = v.InferOutput<typeof trueO>;
    expectTypeOf<Output>().toExtend<Record<string, any>>();
    expectTypeOf<Record<string, any>>().toExtend<Output>();
  });

  test('#03 => keeps parsed entries reachable as any', () => {
    const parsed = v.parse(trueO, { name: 'bemedev' });
    expect(parsed).toStrictEqual({ name: 'bemedev' });
    expectTypeOf(parsed.name).toEqualTypeOf<any>();
  });

  test('#04 => still rejects values that are not plain objects', () => {
    expect(() => v.parse(trueO, [])).toThrow();
    expect(() => v.parse(trueO, new Date())).toThrow();
    expect(() => v.parse(trueO, 123)).toThrow();
    expect(() => v.parse(trueO, Object.create({ toto: 67 }))).toThrow();
  });
});

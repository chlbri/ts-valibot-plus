import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { soa } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('TESTS', () => {
  describe('#01 => string', () => {
    const schema = soa(v.string());
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightValue1: S = 'Gartner';
    const rightValue2: S = ['one', 'two'];

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty array #1', parameters: [[]], expected: [] },

        {
          invite: 'Single value #1',
          parameters: rightValue1,
          expected: rightValue1,
        },

        {
          invite: 'Array of values #1',
          parameters: [rightValue2],
          expected: rightValue2,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'number', parameters: 123 },
        { invite: 'boolean', parameters: false },
        { invite: 'object', parameters: { toto: 67 } },
        { invite: 'Wrong array #1', parameters: [[66, true]] },
        { invite: 'Wrong array #2', parameters: [['string', 66, true]] },
      ),
    );
  });

  describe('#02 => number', () => {
    const schema = soa(v.number());
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightValue1: S = 40;
    const rightValue2: S = [10, 20, 30];

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty array #1', parameters: [[]], expected: [] },

        {
          invite: 'Single value #1',
          parameters: rightValue1,
          expected: rightValue1,
        },

        {
          invite: 'Array of values #1',
          parameters: [rightValue2],
          expected: rightValue2,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'object', parameters: { toto: 67 } },
        { invite: 'Wrong array #1', parameters: [[66, true]] },
      ),
    );
  });

  describe('#03 => object', () => {
    const schema = soa(v.object({ name: v.string(), age: v.number() }));
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightObject1: S = { name: 'Gartner', age: 40 };
    const rightObject2: S = { name: 'Bri', age: 20 };

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty array #1', parameters: [[]], expected: [] },

        {
          invite: 'Single object #1',
          parameters: rightObject1,
          expected: rightObject1,
        },

        {
          invite: 'Array of objects #1',
          parameters: [[rightObject1, rightObject2]],
          expected: [rightObject1, rightObject2],
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'number', parameters: 123 },
        { invite: 'Wrong object #1', parameters: { name: 67 } },
        { invite: 'Wrong array #1', parameters: [[{ name: 'Gartner' }, 67]] },
      ),
    );
  });
});

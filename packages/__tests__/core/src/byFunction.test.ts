import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { byFunction } from '@bemedev/valibot-extended';
import * as v from 'valibot';

describe('TESTS', () => {
  describe('#01 => string', () => {
    const schema = byFunction(() => v.string());
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightValue1: S = 'Gartner';

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success({
        invite: 'Right value #1',
        parameters: rightValue1,
        expected: rightValue1,
      }),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'number', parameters: 123 },
        { invite: 'boolean', parameters: false },
        { invite: 'object', parameters: { toto: 67 } },
        { invite: 'array', parameters: [['one', 'two']] },
      ),
    );
  });

  describe('#02 => number', () => {
    const schema = byFunction(() => v.number());
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightValue1: S = 40;

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success({
        invite: 'Right value #1',
        parameters: rightValue1,
        expected: rightValue1,
      }),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'object', parameters: { toto: 67 } },
        { invite: 'array', parameters: [['one', 'two']] },
      ),
    );
  });

  describe('#03 => object', () => {
    const schema = byFunction(() => v.object({ name: v.string() }));
    const parse = v.parser(schema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof schema>;
    const rightObject1: S = { name: 'Gartner' };

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success({
        invite: 'Right object #1',
        parameters: rightObject1,
        expected: rightObject1,
      }),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'number', parameters: 123 },
        { invite: 'Wrong object #1', parameters: { name: 67 } },
        { invite: 'array', parameters: [[{ name: 'Gartner' }]] },
      ),
    );
  });
});

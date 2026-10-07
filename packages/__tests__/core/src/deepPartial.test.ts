import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { deepPartial } from '@bemedev/valibot-extended/deepPartial';
import * as v from 'valibot';

describe('TESTS', () => {
  const baseSchema1 = v.object({
    name: v.string(),
    age: v.number(),
    nested: v.object({ tag: v.string() }),
    tags: v.array(v.string()),
  });

  describe('#01 => object', () => {
    const partialSchema = deepPartial(baseSchema1);
    const parse = v.parser(partialSchema);
    const { acceptation, success, fails } = createTests(parse);
    describe('#00 => Acceptation', acceptation);
    type S = v.InferOutput<typeof partialSchema>;
    const rightObject1: S = { age: 10 };
    const rightObject2: S = { name: 'Gartner' };

    const rightObject3: S = {
      name: 'Gartner',
      age: 40,
      nested: { tag: 'old' },
      tags: ['smart', 'strong'],
    };

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty object #1', parameters: {}, expected: {} },

        {
          invite: 'Right object #1',
          parameters: rightObject1,
          expected: rightObject1,
        },

        {
          invite: 'Right object #2',
          parameters: rightObject2,
          expected: rightObject2,
        },

        {
          invite: 'Right object #3',
          parameters: rightObject3,
          expected: rightObject3,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'Wrong format object', parameters: { toto: 67 } },
      ),
    );
  });

  describe('#02 => Array', () => {
    const baseSchema2 = v.array(v.string());

    const partialSchema = deepPartial(baseSchema2);
    const parse = v.parser(partialSchema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof partialSchema>;
    const rightObject1: S = ['one'];
    const rightObject2: S = ['name', 'firstName'];

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty object #1', parameters: [[]], expected: [] },

        {
          invite: 'Right object #1',
          parameters: [rightObject1],
          expected: rightObject1,
        },

        {
          invite: 'Right object #2',
          parameters: [rightObject2],
          expected: rightObject2,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'Wrong format object', parameters: { toto: 67 } },
        { invite: 'Wrong array #1', parameters: [66, true] },
        { invite: 'Wrong array #2', parameters: ['string', 66, true] },
      ),
    );
  });

  describe('#03 => Array of Objects', () => {
    const partialSchema = deepPartial(v.array(baseSchema1));
    const parse = v.parser(partialSchema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof partialSchema>;
    const rightObject1: S = [{ age: 10 }];
    const rightObject2: S = [{ name: 'Gartner' }, { tags: ['smart', 'strong'] }];

    const rightObject3: S = [
      {
        name: 'Gartner',
        age: 40,
        nested: { tag: 'old' },
        tags: ['smart', 'strong'],
      },
      ...rightObject1,
      ...rightObject2,
    ];

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        { invite: 'Empty object #1', parameters: [[]], expected: [] },

        {
          invite: 'Right object #1',
          parameters: [rightObject1],
          expected: rightObject1,
        },

        {
          invite: 'Right object #2',
          parameters: [rightObject2],
          expected: rightObject2,
        },

        {
          invite: 'Right object #3',
          parameters: [rightObject3],
          expected: rightObject3,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'Wrong format object', parameters: { toto: 67 } },
        { invite: 'Wrong array #1', parameters: [[66, true]] },
        { invite: 'Wrong array #2', parameters: [['string', 66, true]] },
        { invite: 'Wrong array #3', parameters: rightObject3 },
        { invite: 'Wrong array #4', parameters: [[...rightObject3, 45]] },
      ),
    );
  });

  describe('#04 => tuple', () => {
    const baseSchema2 = v.tuple([baseSchema1, v.string()]);
    const partialSchema = deepPartial(baseSchema2);
    const parse = v.parser(partialSchema);
    const { acceptation, success, fails } = createTests(parse);
    type S = v.InferOutput<typeof partialSchema>;
    const rightObject1: S = [{ age: 10 }, 'ok'];
    const rightObject2: S = [{ name: 'Gartner' }, 'string'];

    const rightObject3: S = [
      {
        name: 'Gartner',
        age: 40,
        nested: { tag: 'old' },
        tags: ['smart', 'strong'],
      },
      'string',
    ];

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'Right object #1',
          parameters: [rightObject1],
          expected: rightObject1,
        },

        {
          invite: 'Right object #2',
          parameters: [rightObject2],
          expected: rightObject2,
        },

        {
          invite: 'Right object #3',
          parameters: [rightObject3],
          expected: rightObject3,
        },
      ),
    );

    describe(
      '#02 => fails',
      fails(
        { invite: 'Empty object #1', parameters: [[]] },
        { invite: 'undefined' },
        { invite: 'string', parameters: 'string' },
        { invite: 'boolean', parameters: false },
        { invite: 'Wrong format object', parameters: { toto: 67 } },
        { invite: 'Wrong array #1', parameters: [[66, true]] },
        { invite: 'Wrong array #2', parameters: [['string', 66, true]] },
        { invite: 'Wrong array #3', parameters: rightObject3 },
        { invite: 'Wrong array #4', parameters: [[...rightObject3, 45]] },
      ),
    );
  });
});


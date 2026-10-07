import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { deepPartial } from '@bemedev/valibot-extended/deepPartial';
import * as v from 'valibot';

describe('TESTS', () => {
  describe('#01 => object', () => {
    const baseSchema = v.object({
      name: v.string(),
      age: v.number(),
      nested: v.object({ tag: v.string() }),
      tags: v.array(v.string()),
    });

    const partialSchema = deepPartial(baseSchema);
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

  describe('#02 => Array',()=>{
    
  });
});

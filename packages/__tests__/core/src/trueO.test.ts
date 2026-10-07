import { createTests } from '@bemedev/dev-utils/vitest-extended';
import { trueO } from '@bemedev/valibot-extended/trueO';
import * as v from 'valibot';

class Custom {
  public readonly name = 'Gartner';
}

describe('TESTS', () => {
  const parse = v.parser(trueO);
  const { acceptation, success, fails } = createTests(parse);
  type S = v.InferOutput<typeof trueO>;
  const rightObject1: S = {};
  const rightObject2: S = { name: 'Gartner' };

  const rightObject3: S = {
    name: 'Gartner',
    age: 40,
    nested: { tag: 'old' },
    tags: ['smart', 'strong'],
  };

  const nullPrototypeObject: S = Object.assign(Object.create(null), rightObject2);
  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'Empty object #1',
        parameters: rightObject1,
        expected: rightObject1,
      },

      {
        invite: 'Right object #1',
        parameters: rightObject2,
        expected: rightObject2,
      },

      {
        invite: 'Right object #2',
        parameters: rightObject3,
        expected: rightObject3,
      },

      {
        invite: 'Null-prototype object #1',
        parameters: nullPrototypeObject,
        expected: rightObject2,
      },
    ),
  );

  describe(
    '#02 => fails',
    fails(
      { invite: 'undefined' },
      { invite: 'null', parameters: [null] },
      { invite: 'number', parameters: 123 },
      { invite: 'string', parameters: 'string' },
      { invite: 'boolean', parameters: false },
      { invite: 'function', parameters: () => 'string' },
      { invite: 'Empty array #1', parameters: [[]] },
      { invite: 'Array of values #1', parameters: [[123, 'string']] },
      { invite: 'Date', parameters: new Date() },
      { invite: 'Map', parameters: new Map() },
      { invite: 'Class instance #1', parameters: new Custom() },
      {
        invite: 'Object with a prototype #1',
        parameters: Object.create({ toto: 67 }),
      },
    ),
  );
});

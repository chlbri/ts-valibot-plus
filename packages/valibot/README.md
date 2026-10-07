# @bemedev/valibot-extended

Extra helpers for [Valibot](https://valibot.dev): `byFunction`, `deepPartial`, `soa`
and `trueO`.

<br/>

## Installation

```bash
pnpm add @bemedev/valibot-extended
# or
npm install @bemedev/valibot-extended
```

`valibot` (`^1.5.0`) ships as a direct dependency, so it does not need to be
installed separately. The package is published as a dual ESM/CJS build with its type
declarations, so it works in both `import` and `require` contexts.

<br/>

## Exports

| Export              | Sub-path       | Description                                                              |
| ------------------- | -------------- | ------------------------------------------------------------------------ |
| `byFunction`        | `/byFunction`  | Lazy schema evaluator returning the schema built by a factory            |
| `deepPartial`       | `/deepPartial` | Recursively converts an object, tuple or array schema into a partial one |
| `soa`               | `/soa`         | Union accepting either a single value or an array of values              |
| `trueO`             | `/trueO`       | Schema accepting only plain objects                                      |
| `DeepPartial`       | `/deepPartial` | Recursive deep partial type                                              |
| `DeepPartialSchema` | `/deepPartial` | Schema type produced by `deepPartial`                                    |

Every export is available from the package root and from a dedicated sub-path:

```ts
import { byFunction, deepPartial, soa, trueO } from '@bemedev/valibot-extended';
import { deepPartial } from '@bemedev/valibot-extended/deepPartial';
```

<br/>

## `byFunction`

Defers the creation of a schema, which keeps recursive and mutually referencing
schemas easy to declare.

```ts
import { byFunction } from '@bemedev/valibot-extended';
import * as v from 'valibot';

const schema = byFunction(() => v.object({ name: v.string(), age: v.number() }));

type User = v.InferOutput<typeof schema>;
// { name: string; age: number }

const parse = v.parser(schema);
parse({ name: 'Gartner', age: 40 }); // => { name: 'Gartner', age: 40 }
parse({ name: 'Gartner', age: 'old' } as any); // => throws
```

<br/>

## `deepPartial`

Turns every object entry optional, recursively. Arrays and tuples recurse into their
items while keeping their shape, and any other schema is returned untouched. Objects
are rebuilt as strict partial objects, so unknown keys are rejected.

```ts
import { deepPartial } from '@bemedev/valibot-extended/deepPartial';
import * as v from 'valibot';

const base = v.object({
  name: v.string(),
  nested: v.object({ tag: v.string() }),
  tags: v.array(v.string()),
});

const schema = deepPartial(base);
const parse = v.parser(schema);

parse({}); // => {}
parse({ name: 'Gartner', nested: { tag: 'old' } }); // => valid
parse({ tags: ['smart', 'strong'] }); // => valid
parse({ toto: 67 } as any); // => throws (unknown key)

type Shape = v.InferOutput<typeof schema>;
// { name?: string; nested?: { tag?: string }; tags?: string[] }
```

Tuples keep their length and element order:

```ts
const tuple = deepPartial(v.tuple([base, v.string()]));
// [{ name?: string; ... }, string]
```

<br/>

### `DeepPartial` and `DeepPartialSchema`

Both types let you describe a deeply optional shape without re-declaring it, and pin
a schema variable to the exact schema `deepPartial` produces.

```ts
import {
  deepPartial,
  type DeepPartial,
  type DeepPartialSchema,
} from '@bemedev/valibot-extended';
import * as v from 'valibot';

const base = v.object({ name: v.string(), nested: v.object({ tag: v.string() }) });

type Shape = DeepPartial<v.InferOutput<typeof base>>;
// { name?: string; nested?: { tag?: string } }

const schema: DeepPartialSchema<typeof base> = deepPartial(base);
```

<br/>

## `soa`

Wraps a schema into a union accepting either a single value or an array of values —
handy for struct-of-arrays payloads coming from a CSV or an API.

```ts
import { soa } from '@bemedev/valibot-extended';
import * as v from 'valibot';

const schema = soa(v.object({ name: v.string(), age: v.number() }));
const parse = v.parser(schema);

const many = [
  { name: 'Gartner', age: 40 },
  { name: 'Bri', age: 20 },
];

parse({ name: 'Gartner', age: 40 }); // => { name: 'Gartner', age: 40 }
parse([]); // => []
parse(many); // => array of objects
parse(123 as any); // => throws
```

<br/>

## `trueO`

Validates that the input is a "true" plain object. Arrays, `null`, primitives, class
instances and any object with a custom prototype are rejected, while objects created
from `{}` or `Object.create(null)` are accepted.

```ts
import { trueO } from '@bemedev/valibot-extended/trueO';
import * as v from 'valibot';

const parse = v.parser(trueO);

parse({}); // => {}
parse({ name: 'Gartner' }); // => { name: 'Gartner' }
parse({ nested: { tag: 'old' }, tags: ['smart'] }); // => valid
parse(Object.assign(Object.create(null), { name: 'Gartner' })); // => valid
parse([]); // => throws
parse(new Date()); // => throws
parse(Object.create({ toto: 67 })); // => throws
parse(123 as any); // => throws

type Shape = v.InferOutput<typeof trueO>;
// Record<string, any>
```

<br/>

## Development

From `packages/valibot`:

```bash
pnpm run build   # bundle the library with rolldown
pnpm run test    # run the Vitest suite, coverage enabled by default
pnpm run lint    # format with oxfmt, then lint with oxlint
```

<br/>

## Licence

[MIT](LICENSE)

## CHANGE_LOG

Read [CHANGELOG.md](CHANGELOG.md) for more details about the changes.

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/ts-valibot-plus)

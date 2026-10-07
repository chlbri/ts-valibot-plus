## CHANGELOG

<details>
<summary>

## **[0.1.3] - 07/10/2026** => _13:13_

</summary>

- Add the `trueO` public API: a schema accepting only plain objects, i.e. objects
  whose prototype is `Object.prototype` or `null`, and rejecting arrays, `null`,
  primitives and class instances. It is re-exported from `src/index.ts` and reachable
  through the `@bemedev/valibot-extended/trueO` sub-path.
- Add unit and type-level tests for `trueO`, along with a shared `schemaCheck`
  importer expectation in the test fixtures.
- Rename the Vitest project from `__tests__/core` to `core`.
- Improve the JSDoc of `byFunction`, `deepPartial` and `soa`: target `@template`
  types, typed `@param` references and `@see` links.
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.2] - 07/10/2026** => _02:06_

</summary>

- Update the package description to `Valibot utilities`.
- Add the package documentation in `README.md`: installation, exports table, usage
  examples for `byFunction`, `deepPartial` and `soa`, and the `DeepPartial` /
  `DeepPartialSchema` types.
- <u>Test coverage **_100%_**</u>

</details>

<br/>

<details>
<summary>

## **[0.1.1] - 07/10/2026** => _02:02_

</summary>

- **BREAKING CHANGE**: Rename the package to `@bemedev/valibot-extended` (previously
  `@bemedev/new-package-name-to-change`) and move the sources from `packages/core` to
  `packages/valibot`.
- Add the public API `byFunction`, `deepPartial` and `soa`, re-exported from
  `src/index.ts` and reachable through the `@bemedev/valibot-extended/*` sub-paths.
- Add the `DeepPartial` and `DeepPartialSchema` types alongside the internal `Base`,
  `CanPartial`, `Entries` and `MaybeReadonly` helpers.
- Enhance `deepPartial` to support tuples, preserving their length, element order and
  `readonly` modifiers, as well as `strictObject` schemas.
- Enhance the NPM publish workflow with a build job, a workspace artifact, the
  `./packages/valibot` package target and artifact cleanup.
- Fix `deepPartial` object handling: partial objects are now built with
  `v.partial(v.strictObject(...))` instead of wrapping every entry with `v.optional`,
  and array schemas are processed first.
- Add complete JSDoc on `src/byFunction.ts`, `src/deepPartial.ts` and `src/soa.ts`,
  including `@template`, `{@linkcode}` references and `@see` sections.
- Refactor the test suite under `packages/__tests__/core` around shared `createTests`
  helpers with Acceptation, Success and Fails sections.
- Add type-level tests for `byFunction`, `deepPartial` and `soa`, executed by Vitest.
- Update package metadata (keywords, repository URL) and CI scripts (`ci`, `rm`,
  `rm:lib`, `test:coverage`, `test:watch`).
- Add `valibot` (`^1.5.0`) as a production dependency.
- <u>Test coverage **_100%_**</u>

</details>

<br/>

### Version [0.0.1] --> _date & hour_

- ✨ Première version de la bibliothèque

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My github](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- [Documentation](https://github.com/chlbri/ts-valibot-plus)

export type Expecter = (value?: any) => void | Promise<void>;

export type ImporterProps = {
  path?: string;
  expect: Expecter;
  success?: [string, ...string[]];
  fails?: [string, ...string[]];
};

export const logIndex = (allLen = 0, index = 0) => {
  return (index + 1).toLocaleString().padStart(Math.log10(allLen) + 1, '0');
};

export const createImporterTests = (...params: ImporterProps[]) => {
  return () => {
    const allLen = params.length;
    params.forEach((props, _index) => {
      const _path = props.path ?? '';
      const __path = _path === '' ? '/' : _path;
      const path = `@bemedev/valibot-extended${_path}`;
      const success = props.success;
      const fails = props.fails;
      const index = logIndex(allLen, _index);

      const createModule = () => import(path);

      if (success || fails) {
        const hasSuccess = success && success.length > 0;

        describe(`#${index} => Check imports from path "${__path}"`, () => {
          let module: any;

          beforeAll(async () => {
            module = await createModule();
          });

          /* v8 ignore else -- @preserve */
          if (hasSuccess) {
            if (success.length === 1) {
              test(`#01 => Success for "${success[0]}"`, () =>
                props.expect(module[success[0]]));
            } else
              describe(`#1 => Check success for path "${__path}"`, () => {
                test.each(success)('#%$ => for "%s"', async key => {
                  await props.expect(module[key]);
                });
              });
          }

          /* v8 ignore else -- @preserve */
          if (fails) {
            const index = hasSuccess ? '2' : '1';

            if (fails.length === 1) {
              return test.fails(`#${index} => Failed for "${fails[0]}"`, () =>
                props.expect(module[fails[0]]));
            }

            describe(`#${index} => Check fails for path "${__path}"`, () => {
              test.fails.each(fails)('#%$ => for "%s"', async key => {
                await props.expect(module[key]);
              });
            });
          }
        });
      } else {
        test(`Test the default export of "${__path}"`, async () => {
          const module = await createModule();
          await props.expect(module);
        });
      }
    });
  };
};

export const functionCheck: Expecter = value => {
  return expect(value).toBeTypeOf('function');
};

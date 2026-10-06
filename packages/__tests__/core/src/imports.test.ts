import { createImporterTests, functionCheck as expect } from './fixtures';

describe(
  'valibot lib exports',
  createImporterTests(
    {
      expect,
      success: ['byFunction', 'soa', 'deepPartial'],
      fails: ['__nonExistent__'],
    },

    {
      expect,
      success: ['byFunction'],
      fails: ['soa', 'deepPartial'],
      path: '/byFunction',
    },

    {
      expect,
      success: ['deepPartial'],
      fails: ['byFunction', 'soa'],
      path: '/deepPartial',
    },

    { expect, success: ['soa'], fails: ['byFunction', 'deepPartial'], path: '/soa' },
  ),
);

import {
  createImporterTests,
  functionCheck as expect,
  schemaCheck,
} from './fixtures';

describe(
  'valibot lib exports',
  createImporterTests(
    {
      expect,
      success: ['byFunction', 'soa', 'deepPartial'],
      fails: ['__nonExistent__', 'trueO'],
    },

    {
      expect: schemaCheck,
      success: ['trueO'],
      fails: ['__nonExistent__', 'byFunction', 'soa', 'deepPartial'],
    },

    {
      expect,
      success: ['byFunction'],
      fails: ['soa', 'deepPartial', 'trueO'],
      path: '/byFunction',
    },

    {
      expect,
      success: ['deepPartial'],
      fails: ['byFunction', 'soa', 'trueO'],
      path: '/deepPartial',
    },

    {
      expect,
      success: ['soa'],
      fails: ['byFunction', 'deepPartial', 'trueO'],
      path: '/soa',
    },

    {
      expect: schemaCheck,
      success: ['trueO'],
      fails: ['byFunction', 'deepPartial', 'soa'],
      path: '/trueO',
    },
  ),
);



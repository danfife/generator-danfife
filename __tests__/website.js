'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-danfife:website', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/website'))
      .withPrompts({ name: 'Test App', s3bucket: 'test-s3-bucket' });
  });

  it('creates files', () => {
    assert.file(['package.json', 'public/index.html', 'public/favicon.gif']);
  });

  it('substitutes package name', () => {
    assert.fileContent('package.json', '"name": "Test App"');
  });

  it('substitutes s3bucket', () => {
    assert.fileContent('package.json', '"s3bucket": "test-s3-bucket"');
  });
});

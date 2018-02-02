var assert = require('chai').assert;
require('../public/js/main');

describe('A test suite', function() {
   beforeEach(function() { });
   afterEach(function() { });
   it('should pass', function() {
   		assert.isTrue(true, 'passes');
   });
});
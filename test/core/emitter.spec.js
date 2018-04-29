import { Emitter } from '../../src/core/emitter';

import { expect } from 'chai';

describe('Core/Emitter', function () {
  describe('contructor()', function () {
    it('should be a function', function () {
      expect(Emitter).to.be.a('function');
    });
  });
});

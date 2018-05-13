import { Geometry } from '../../src/maths/geometry';

import { expect } from 'chai';

describe('Maths/Geometry', function () {
  describe('toRadians()', function () {
    it('should be a function', function () {
      expect(Geometry.toRadians).to.be.a('function');
    });

    describe('given zero degrees', function () {
      it('should return zero radians', function () {
        const result = Geometry.toRadians(0);
        expect(result).to.equal(0);
      });
    });

    describe('given 45 degrees', function () {
      it('should return a quarter PI', function () {
        const result = Geometry.toRadians(45);
        expect(result).to.equal(Math.PI / 4);
      });
    });

    describe('given -45 degrees', function () {
      it('should return negative quarter PI', function () {
        const result = Geometry.toRadians(-45);
        expect(result).to.equal(-Math.PI / 4);
      });
    });
  });

  describe('toDegrees()', function () {
    it('should be a function', function () {
      expect(Geometry.toDegrees).to.be.a('function');
    });

    describe('given zero radians', function () {
      it('should return zero radians', function () {
        const result = Geometry.toDegrees(0);
        expect(result).to.equal(0);
      });
    });

    describe('given quarter PI radians', function () {
      it('should return a 45 degreens', function () {
        const result = Geometry.toDegrees(Math.PI / 4);
        expect(result).to.equal(45);
      });
    });

    describe('given negative quarter PI radians', function () {
      it('should return -45 degrees', function () {
        const result = Geometry.toDegrees(-Math.PI / 4);
        expect(result).to.equal(-45);
      });
    });
  });
});

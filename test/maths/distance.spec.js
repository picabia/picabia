import { Distance } from '../../src/maths/distance';

import { expect } from 'chai';

describe('Maths/Distance', function () {
  describe('pointToPointSquare()', function () {
    it('should be a function', function () {
      expect(Distance.pointToPointSquare).to.be.a('function');
    });

    describe('given the same point', function () {
      it('should return zero', function () {
        const pointA = {x: 5, y: 5};
        const pointB = {x: 5, y: 5};
        const result = Distance.pointToPointSquare(pointA, pointB);
        expect(result).to.equal(0);
      });
    });

    describe('given different point', function () {
      it('should the expected distance squared', function () {
        const pointA = {x: 5, y: 5};
        const pointB = {x: 7, y: 7};
        const result = Distance.pointToPointSquare(pointA, pointB);
        expect(result).to.equal(8);
      });
    });
  });
});

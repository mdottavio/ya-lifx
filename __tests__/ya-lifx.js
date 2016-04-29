'use strict';
jest.unmock('../ya-lifx');

describe('ya-lifx', () => {
  it('should exports 6 metohds', () => {
    const yaLifx = require('../ya-lifx');

    console.log(yaLifx);
    // expect(sum(1, 2)).toBe(3);
  });
});

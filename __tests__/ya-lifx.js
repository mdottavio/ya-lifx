'use strict';

jest.dontMock('../ya-lifx');

const yaLifx = require('../ya-lifx');
const requestHandler = require('../src/requestHandler');

yaLifx.init('aFakeToken');

describe('ya-lifx', () => {

  beforeEach(() => {
    requestHandler.get.mockClear();
    requestHandler.post.mockClear();
    requestHandler.put.mockClear();
  });

  it('should exports public metohds', () => {
    expect(yaLifx.init).toEqual(jasmine.any(Function));
    expect(yaLifx.listLights).toEqual(jasmine.any(Function));
    expect(yaLifx.listScenes).toEqual(jasmine.any(Function));
    expect(yaLifx.validateColor).toEqual(jasmine.any(Function));
    expect(yaLifx.setState).toEqual(jasmine.any(Function));
    expect(yaLifx.activateScene).toEqual(jasmine.any(Function));
    expect(yaLifx.toggle).toEqual(jasmine.any(Function));
    expect(yaLifx.breathe).toEqual(jasmine.any(Function));
    expect(yaLifx.pulse).toEqual(jasmine.any(Function));
    expect(yaLifx.cycle).toEqual(jasmine.any(Function));
  });

  it('should call the GET method when list the lights', () => {
    yaLifx.listLights();

    expect(requestHandler.get.mock.calls.length).toBe(1);
  });

  it('should call the GET method when list the scenes', () => {
    yaLifx.listScenes();

    expect(requestHandler.get.mock.calls.length).toBe(1);
  });

  it('should call the GET method when validate a color', () => {
    yaLifx.validateColor('red');

    expect(requestHandler.get.mock.calls.length).toBe(1);
  });

  it('should call the PUT method when setting a state', () => {
    yaLifx.setState('d3b2f2d97452', {
      power: 'on',
      color: 'blue saturation:0.5',
      brightness: 0.5,
      duration: 5
    });

    expect(requestHandler.put.mock.calls.length).toBe(1);
  });

  it('should call the PUT method when activate an scene', () => {
    yaLifx.activateScene('55a0db9d-3ea7-4973-9b15-b149215bd4db', 1.0);

    expect(requestHandler.put.mock.calls.length).toBe(1);
  });

  it('should call the POST method when toggle', () => {
    yaLifx.toggle('all', 1.0);

    expect(requestHandler.post.mock.calls.length).toBe(1);
  });

  it('should call the POST method when breathe', () => {
    yaLifx.breathe('all', {
      period: 2,
      cycles: 5,
      color: 'green',
      from_color: 'red',
      persist: true,
      power_on: false,
      peak: .8
    });

    expect(requestHandler.post.mock.calls.length).toBe(1);
  });

  it('should call the POST method when breathe with less params', () => {
    yaLifx.breathe('all', {
      period: 2,
      cycles: 5,
      color: 'green'
    });

    expect(requestHandler.post.mock.calls.length).toBe(1);
  });

  it('should call the POST method when pulse', () => {
    yaLifx.pulse('all', {
      period: 2,
      cycles: 5,
      color: 'green'
    });

    expect(requestHandler.post.mock.calls.length).toBe(1);
  });

  it('should call the POST method when cycle', () => {
    yaLifx.cycle('all', [
      {
        brightness: 1.0
      },
      {
        brightness: 0.5
      },
      {
        brightness: 0.1
      },
      {
        power: 'off'
      }
    ], {
      power: 'on',
      saturation: 0,
      duration: 2.0
    }
    );

    expect(requestHandler.post.mock.calls.length).toBe(1);
  });
});

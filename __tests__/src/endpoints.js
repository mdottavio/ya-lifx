'use strict';

jest.dontMock('../../src/endpoints');

const endpoints = require('../../src/endpoints');
const data = {
  selector: 'all',
  color: 'red',
  sceneId: '12345'
};

describe('endpoints', () => {
  it('should exports public metohds', () => {
    expect(endpoints.get).toEqual(jasmine.any(Object));
    expect(endpoints.put).toEqual(jasmine.any(Object));
    expect(endpoints.post).toEqual(jasmine.any(Object));
  });

  it('should return valid URLs', () => {
    expect(endpoints.get.lights(data)).toEqual('lights/all');
    expect(endpoints.get.scenes()).toEqual('scenes');
    expect(endpoints.get.color(data)).toEqual('color?string=red');

    expect(endpoints.put.lights(data)).toEqual('lights/all/state');
    expect(endpoints.put.scenes(data)).toEqual('scenes/scene_id:12345/activate');

    expect(endpoints.post.lights.toggle(data)).toEqual('lights/all/toggle');
    expect(endpoints.post.lights.effects.breathe(data)).toEqual('lights/all/effects/breathe');
    expect(endpoints.post.lights.effects.pulse(data)).toEqual('lights/all/effects/pulse');
    expect(endpoints.post.lights.cycle(data)).toEqual('lights/all/cycle');
  });

});

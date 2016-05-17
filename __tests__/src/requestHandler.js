'use strict';

jest.dontMock('../../src/requestHandler');

jest.mock('request');
const request = require('request');
const requestHdlr = require('../../src/requestHandler');

requestHdlr.setToken('aFakeToken');

describe('requestHandler', () => {

  beforeEach(() => {
    request.mockClear();
  });

  it('should exports public metohds', () => {
    expect(requestHdlr.setToken).toEqual(jasmine.any(Function));
    expect(requestHdlr.get).toEqual(jasmine.any(Function));
    expect(requestHdlr.post).toEqual(jasmine.any(Function));
    expect(requestHdlr.put).toEqual(jasmine.any(Function));
  });

  it('should perform a GET request', () => {
    requestHdlr.get('testEndpoint');
    expect(request.mock.calls.length).toBe(1);
    expect(request.mock.calls[0][0].uri).toBe('https://api.lifx.com/v1/testEndpoint');
    expect(request.mock.calls[0][0].method).toEqual('GET');
    expect(request.mock.calls[0][0].headers.Authorization).toBe('Bearer aFakeToken');
  });

  it('should perform a POST request', () => {
    let fakeData =  {duration: 1.2};
    requestHdlr.post('postTestEndpoint', fakeData);
    expect(request.mock.calls.length).toBe(1);
    expect(request.mock.calls[0][0].uri).toBe('https://api.lifx.com/v1/postTestEndpoint');
    expect(request.mock.calls[0][0].method).toEqual('POST');
    expect(request.mock.calls[0][0].form).toEqual(fakeData);
    expect(request.mock.calls[0][0].headers.Authorization).toBe('Bearer aFakeToken');
  });

  it('should perform a PUT request', () => {
    let fakeData =  {duration: 1.2, secondParam: 'abc'};
    requestHdlr.put('putTestEndpoint', fakeData);
    expect(request.mock.calls.length).toBe(1);
    expect(request.mock.calls[0][0].uri).toBe('https://api.lifx.com/v1/putTestEndpoint');
    expect(request.mock.calls[0][0].method).toEqual('PUT');
    expect(request.mock.calls[0][0].form).toEqual(fakeData);
    expect(request.mock.calls[0][0].headers.Authorization).toBe('Bearer aFakeToken');
  });

});

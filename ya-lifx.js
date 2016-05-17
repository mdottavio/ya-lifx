'use strict';

let requestHdlr = require('./src/requestHandler');
let endpoints = require('./src/endpoints');

let lifxAPI = function() {

  let _init = function(aToken) {

    requestHdlr.setToken(aToken);
  };

  let validateState = function(aState) {
    let validState = {};

    if (aState.power === 'on' || aState.power === 'off') {
      validState.power = aState.power;
    }

    if (typeof aState.color === 'string' && aState.color !== '') {
      validState.color = aState.color;
    }

    if (typeof aState.brightness === 'number' &&
      (aState.brightness > 0 && aState.brightness < 1)) {
      validState.brightness = aState.brightness;
    }

    if (typeof aState.duration === 'number' &&
      (aState.duration > 1 && aState.duration < 3155760000.0)) {
      validState.duration = aState.duration;
    }

    return validState;
  };

  let validateEffectParams = function(params) {
    let validParams = {};

    if (typeof params.color === 'string' && params.color !== '') {
      validParams.color = params.color;
    }

    if (typeof params.from_color === 'string' && params.from_color !== '') {
      validParams.from_color = params.from_color;
    }

    if (typeof params.period === 'number') {
      validParams.period = params.period;
    }

    if (typeof params.cycles === 'number') {
      validParams.cycles = params.cycles;
    }

    if (typeof params.persist === 'boolean') {
      validParams.persist = params.persist;
    }

    if (typeof params.power_on === 'boolean') {
      validParams.power_on = params.power_on;
    }

    if (typeof params.peak === 'number' &&
      (params.peak > 0 && params.peak < 1)) {
      validParams.peak = params.peak;
    }

    return params;
  };

  /**
   * Gets lights belonging to the authenticated account.
   *
   * Doc: http://api.developer.lifx.com/docs/list-lights
   * @param {String} aSelector The selector to limit which lights are controlled.
   *                           all by default
   * @return {Object}
   */
  let _listLights = function(aSelector) {

    aSelector = aSelector || 'all';

    return requestHdlr.get(endpoints.get.lights({ selector: aSelector }));
  };

  /**
   * Lists all the scenes available in the users account.
   *
   * Doc: http://api.developer.lifx.com/docs/list-scenes
   * @return {Object}
   */
  let _listScenes = function() {

    return requestHdlr.get(endpoints.get.scenes());
  };

  /**
   * Validate a user's color string and return the hue, saturation
   * brightness and kelvin values that the API will interpret as.
   *
   * Doc: http://api.developer.lifx.com/docs/validate-color
   * @param  {String} aColor Color string you'd like to validate
   * @return {Object}
   */
  let _validateColor = function(aColor) {

    return requestHdlr.get(endpoints.get.color({color: aColor}));
  };

  /**
   * Sets the state of the lights within the selector.
   *
   * Doc: http://api.developer.lifx.com/docs/set-state
   * @param  {String} aSelector The selector to limit which lights are controlled.all by default
   * @param  {Object} aState    properties to change:
   *  @property {String} power      The power state you want to set on the selector. on or off
   *  @property {String} color      The color to set the light to.
   *  @property {Double} brightness The brightness level from 0.0 to 1.0. Overrides any  brightness
   *                                set in color (if any).
   *  @property {Double} duration   How long in seconds you want the power action to take.
   *                                Range: 0.0 – 3155760000.0 (100 years)
   * @return {Object}
   */
  let _setState = function(aSelector, aState) {
    aSelector = aSelector || 'all';

    aState = validateState(aState);

    return requestHdlr.put(endpoints.put.lights({selector: aSelector}), aState);
  };

  /**
   * Activates a scene from the users account
   *
   * Doc: http://api.developer.lifx.com/docs/activate-scene
   * @param  {String} aScene   The UUID for the scene you wish to activate
   * @param  {Double} theDuration The time in seconds to spend performing the scene transition.
   * @return {Object}
   */
  let _activateScene = function(aScene, theDuration) {

    return requestHdlr.put(endpoints.put.scenes({sceneId: aScene}), {duration: theDuration});
  };

  /**
   * Turn off lights if they are on, or turn them on if they are off.
   *
   * Doc: http://api.developer.lifx.com/docs/toggle-power
   * @param  {String} aSelector The selector to limit which lights are toggled.
   * @param  {Double} theDuration The time is seconds to spend perfoming the power toggle.
   * @return {Object}
   */
  let _toggle = function(aSelector, theDuration) {
    aSelector = aSelector || 'all';

    return requestHdlr.post(endpoints.post.lights.toggle({selector: aSelector}), {duration: theDuration});
  };

  /**
   * Performs a breathe effect by slowly fading between the given colors.
   *
   * Doc: http://api.developer.lifx.com/docs/breathe-effect
   * @param  {String} aSelector The selector to limit which lights are controlled. all by default
   * @param  {Object} params    properties to change:
   *  @property {String} color      The color to use for the breathe effect.
   *  @property {String} from_color The color to start the effect from.
   *  @property {String} period     The time in seconds for one cyles of the effect.
   *  @property {String} cycles     The number of times to repeat the effect.
   *  @property {String} persist    If false set the light back to its previous value
   *                                when effect ends, if true leave the last effect color.
   *  @property {String} power_on   If true, turn the bulb on if it is not already on.
   *  @property {String} peak       Defines where in a period the target color is at its maximum.
   * @return {Object}
   */
  let _breathe = function(aSelector, params) {
    aSelector = aSelector || 'all';

    params = validateEffectParams(params);

    return requestHdlr.post(endpoints.post.lights.effects.breathe({selector: aSelector}), params);
  };

  /**
   * Performs a pulse effect by quickly flashing between the given colors.
   *
   * Doc: http://api.developer.lifx.com/docs/pulse-effect
   * @param  {String} aSelector The selector to limit which lights are controlled. all by default
   * @param  {Object} params    properties to change:
   *  @property {String} color      The color to use for the breathe effect.
   *  @property {String} from_color The color to start the effect from.
   *  @property {String} period     The time in seconds for one cyles of the effect.
   *  @property {String} cycles     The number of times to repeat the effect.
   *  @property {String} persist    If false set the light back to its previous value
   *                                when effect ends, if true leave the last effect color.
   *  @property {String} power_on   If true, turn the bulb on if it is not already on.
   *  @property {String} peak       Defines where in a period the target color is at its maximum.
   * @return {Object}
   */
  let _pulse = function(aSelector, params) {
    aSelector = aSelector || 'all';

    params = validateEffectParams(params);

    return requestHdlr.post(endpoints.post.lights.effects.pulse({selector: aSelector}), params);
  };

  /**
   * Make the light(s) cycle to the next or previous state in a list of states.
   *
   * Doc: http://api.developer.lifx.com/docs/cycle
   * @param  {String} aSelector    The selector to limit which lights are controlled. all by default
   * @param  {Array}  theStates    Array of state hashes as per Set State. Must have 2 to 5 entries
   * @param  {Object} theDafaults  Default values to use when not specified in each states[] object.
   * @param  {String} theDirection Direction in which to cycle through the list.
   *                               Can be forward or backward
   * @return {Object}
   */
  let _cycle = function(aSelector, theStates, theDafaults, theDirection) {
    theStates = Array.isArray(theStates) ? theStates : [];

    return requestHdlr.post(endpoints.post.lights.cycle({selector: aSelector}), {
      states: theStates,
      defaults: theDafaults,
      direction: theDirection
    });
  };

  return {
    init: _init,
    listLights: _listLights,
    listScenes: _listScenes,
    validateColor: _validateColor,
    setState: _setState,
    activateScene: _activateScene,
    toggle: _toggle,
    breathe: _breathe,
    pulse: _pulse,
    cycle: _cycle
  };
};

module.exports = lifxAPI();

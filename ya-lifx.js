const RequestHandler = require('./src/requestHandler');
const endpoints = require('./src/endpoints');

class Lifx {

  /**
   * Visit https://cloud.lifx.com/settings to generate your token.
   * @param {String} aToken lifx's token
   */
  constructor(aToken) {
    this.requestHdlr = new RequestHandler(aToken);
    this.endpoints = endpoints;
  }

  /**
   * Validate the given State Object based on:
   * https://api.developer.lifx.com/v1/docs/set-state
   *
   * @param  {Object} [aState={}] The state Object to validate.
   * @return {Object}             An Object with the validated properties.
   */
  _validateState(aState = {}) {
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

    if (typeof aState.infrared === 'number' &&
      (aState.infrared > 0 && aState.infrared < 1)) {
      validState.infrared = aState.infrared;
    }

    if (aState.fast === true || aState.fast === false) {
      validState.fast = aState.fast;
    }

    return validState;
  }

  /**
   * Validate the given Effect Object based on:
   * https://api.developer.lifx.com/docs/breathe-effect
   *
   * @param  {Object} [params={}] The effect Object to validate.
   * @return {Object}             An Object with the validated properties.
   */
  _validateEffectParams(params = {}) {
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
  }

  /**
   * Gets lights belonging to the authenticated account.
   *
   * Doc: http://api.developer.lifx.com/docs/list-lights
   * @param {String} selector The selector to limit which lights are controlled.
   *                           all by default
   * @return {Object}
   */
  listLights(selector = 'all') {
    return this.requestHdlr.get(this.endpoints.get.lights({ selector }));
  };

  /**
   * Lists all the scenes available in the users account.
   *
   * Doc: http://api.developer.lifx.com/docs/list-scenes
   * @return {Object}
   */
  listScenes() {
    return this.requestHdlr.get(this.endpoints.get.scenes());
  }

  /**
   * Validate a user's color string and return the hue, saturation
   * brightness and kelvin values that the API will interpret as.
   *
   * Doc: http://api.developer.lifx.com/docs/validate-color
   * @param  {String} color Color string you'd like to validate
   * @return {Object}
   */
  validateColor(color) {
    return this.requestHdlr.get(this.endpoints.get.color({ color }));
  };

  /**
   * Sets the state of the lights within the selector.
   *
   * Doc: http://api.developer.lifx.com/docs/set-state
   * @param  {String} selector The selector to limit which lights are controlled.all by default
   * @param  {Object} state    properties to change:
   *  @property {String} power      The power state you want to set on the selector. on or off
   *  @property {String} color      The color to set the light to.
   *  @property {Double} brightness The brightness level from 0.0 to 1.0. Overrides any  brightness
   *                                set in color (if any).
   *  @property {Double} duration   How long in seconds you want the power action to take.
   *                                Range: 0.0 – 3155760000.0 (100 years)
   * @return {Object}
   */
  setState(selector, state = 'all') {
    state = this._validateState(state);
    return this.requestHdlr.put(this.endpoints.put.lights({ selector }), state);
  };

  /**
   * Activates a scene from the users account
   *
   * Doc: http://api.developer.lifx.com/docs/activate-scene
   * @param  {String} sceneId   The UUID for the scene you wish to activate
   * @param  {Double} duration The time in seconds to spend performing the scene transition.
   * @return {Object}
   */
  activateScene(sceneId, duration) {
    return this.requestHdlr.put(this.endpoints.put.scenes({ sceneId }), { duration });
  };

  /**
   * Turn off lights if they are on, or turn them on if they are off.
   *
   * Doc: http://api.developer.lifx.com/docs/toggle-power
   * @param  {String} delector The selector to limit which lights are toggled.
   * @param  {Double} duration The time is seconds to spend perfoming the power toggle.
   * @return {Object}
   */
  toggle(selector = 'all', duration = 1.0) {
    return this.requestHdlr.post(this.endpoints.post.lights.toggle({ selector }), { duration });
  };

  /**
   * Performs a breathe effect by slowly fading between the given colors.
   *
   * Doc: http://api.developer.lifx.com/docs/breathe-effect
   * @param  {String} selector  The selector to limit which lights are controlled. all by default
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
  breathe(selector = 'all', params = {}) {
    params = this._validateEffectParams(params);

    return this.requestHdlr.post(this.endpoints.post.lights.effects.breathe({ selector }), params);
  };

  /**
   * Performs a pulse effect by quickly flashing between the given colors.
   *
   * Doc: http://api.developer.lifx.com/docs/pulse-effect
   * @param  {String} selector  The selector to limit which lights are controlled. all by default
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
  pulse(selector = 'all', params) {
    params = this._validateEffectParams(params);

    return this.requestHdlr.post(this.endpoints.post.lights.effects.pulse({ selector }), params);
  };

  /**
   * Make the light(s) cycle to the next or previous state in a list of states.
   *
   * Doc: http://api.developer.lifx.com/docs/cycle
   * @param  {String} selector    The selector to limit which lights are controlled. all by default
   * @param  {Array}  states    Array of state hashes as per Set State. Must have 2 to 5 entries
   * @param  {Object} defaults  Default values to use when not specified in each states[] object.
   * @param  {String} direction Direction in which to cycle through the list.
   *                               Can be forward or backward
   * @return {Object}
   */
  cycle(selector = 'all', states = [], defaults = {}, direction = 'forward') {
    return this.requestHdlr.postJson(this.endpoints.post.lights.cycle({selector}), {
      states,
      defaults,
      direction,
    });
  };

  /**
   * Return the latest API limit available on the client.
   * @return {Object}
   *  @property {Number} limit
   *  @property {Number} remaining
   *  @property {Number} reset
   */
  apiLimits() {
    return this.requestHdlr.getLimits();
  };
}

module.exports = Lifx;

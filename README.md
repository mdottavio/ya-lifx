# :bulb: ya-lifx
> REST client for the [Lifx's API](http://api.developer.lifx.com/); each method of ``ya-lifx`` return a promise which resolve with the API's response;

[![Dev dependencies status](https://david-dm.org/mdottavio/ya-lifx.svg)](https://david-dm.org/mdottavio/ya-lifx#info=dependencies&view=table)


#### Installing
use ``npm`` to install the lib on you proyect;
```bash
npm install ya-lifx
```

#### Usage
You'll need a valid Lifx's token to use the lib; generate it from https://cloud.lifx.com/settings

```javascript
var lifx = require('ya-lifx');

lifx.init('YOUR_TOKEN');
lifx.listLights()
  .then(function(response){
    console.log(response);
    console.log('API Limits ', lifx.apiLimits());

  })
  .catch(function(err){
    console.log('Error');
    console.log(err.error);
    console.log(err.warnings);
  });
```

#### Available methods
The available methods of the lib are:

* ``init``: set the Lifx's token
* [``listLights``](http://api.developer.lifx.com/docs/list-lights): Gets lights belonging to the authenticated account.
* [``listScenes``](http://api.developer.lifx.com/docs/list-scenes): Lists all the scenes available in the users account
* [``validateColor``](http://api.developer.lifx.com/docs/validate-color): Validate a user's color string and return the hue, saturation brightness and kelvin values that the API will interpret as.
* [``setState``](http://api.developer.lifx.com/docs/set-state): Sets the state of the lights within the selector.
* [``activateScene``](http://api.developer.lifx.com/docs/activate-scene): Activates a scene from the users account.
* [``toggle``](http://api.developer.lifx.com/docs/toggle-power): Turn off lights if they are on, or turn them on if they are off.
* [``breathe``](http://api.developer.lifx.com/docs/breathe-effect): Performs a breathe effect by slowly fading between the given colors.
* [``pulse``](http://api.developer.lifx.com/docs/pulse-effect): Performs a pulse effect by quickly flashing between the given colors.
* [``cycle``](http://api.developer.lifx.com/docs/cycle): Make the light(s) cycle to the next or previous state in a list of states.
* `apiRateLimits`: Return the [Rate limit](https://api.developer.lifx.com/docs/rate-limits) from the previous call.

#### Errors and Warnings
Please referer to [Errors documentation](http://api.developer.lifx.com/docs/errors) for more information.  

Inspired by [pifx](https://github.com/cydrobolt/pifx)

## License
[MIT](LICENSE)

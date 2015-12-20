# ya-lifx
> 💡Yet Another LIFX JS client

REST client for the [Lifx's API](http://api.developer.lifx.com/); each method of ``ya-lifx`` return a promise which resolve with the API's response; 

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
  })
  .fail(function(err){
    console.log('Error');
    console.log(err.error);
    console.log(err.warnings);
  });
```

#### Available methods
The available methods of the lib are:

* ``init``: set the Lifx's token
* [``listLights``](http://api.developer.lifx.com/docs/list-lights),
* [``listScenes``](http://api.developer.lifx.com/docs/list-scenes),
* [``validateColor``](http://api.developer.lifx.com/docs/validate-color),
* [``setState``](http://api.developer.lifx.com/docs/set-state),
* [``activateScene``](http://api.developer.lifx.com/docs/activate-scene),
* [``toggle``](http://api.developer.lifx.com/docs/toggle-power),
* [``breathe``](http://api.developer.lifx.com/docs/breathe-effect),
* [``pulse``](http://api.developer.lifx.com/docs/pulse-effect),
* [``cycle``](http://api.developer.lifx.com/docs/cycle)

#### Errors and Warnings
Please referer to [Errors documentation](http://api.developer.lifx.com/docs/errors) for more information.  

Inspired by [pifx](https://github.com/cydrobolt/pifx)

## License
[MIT](LICENSE)

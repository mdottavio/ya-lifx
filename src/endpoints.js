'use strict';
let theSelectors = function() {

  return {
    get: {
      lights: function(data) {
        return `lights/${data.selector}`;
      },
      scenes: function() {
        return `scenes`;
      },
      color: function(data) {
        return `color?string=${data.color}`;
      }
    },
    put: {
      lights: function(data) {
        return `lights/${data.selector}/state`;
      },
      scenes: function(data) {
        return `scenes/scene_id:${data.sceneId}/activate`;
      }
    },
    post:{
      lights:{
        toggle: function(data) {
          return `lights/${data.selector}/toggle`;
        },
        effects: {
          breathe: function(data) {
            return `lights/${data.selector}/effects/breathe`;
          },
          pulse: function(data) {
            return `lights/${data.selector}/effects/pulse`;
          },
        },
        cycle: function(data) {
          return `lights/${data.selector}/cycle`;
        }
      }
    }
  };
};

module.exports = theSelectors();

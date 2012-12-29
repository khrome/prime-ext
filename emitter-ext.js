var prime = require('prime');
var Emitter = require('prime/util/emitter');
module.exports = prime({
    inherits: Emitter,
    once : function(type, fn){
        var ob = this;
        function cb(){
            ob.off(type, cb);
            fn();
        }
        this.on(type, cb);
    }
});
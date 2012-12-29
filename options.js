var ext = require('./prime-ext');
var prime = ext(require('prime'));
var Class = require('Classy');
module.exports = new Class({
    setOptions : function(options){
        if(!this.options) this.options = {};
        if(options) this.options = prime.interleave(this.options, options);
        if(this.emit && this.on) prime.each(this.options, function(value, key){
            if(
                this.on && key.substring(0,2) == 'on' &&
                 key.substring(2,3) == key.substring(2,3).toUpperCase()
            ){
                var event = key.substring(2,3).toLowerCase()+key.substring(3);
                this.on(event, value);
            }
        });
    }
});
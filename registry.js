var Class = require('Classy');
module.exports = new Class({
    registry : {},
    initialize : function(name){
    
    },
    register : function(key, value){
        this.registry[key] = value;
    },
    require : function(key){
        return this.registry[key];
    }
});
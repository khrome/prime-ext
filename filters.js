var ext = require('./prime-ext');
var prime = require('prime');
var array = ext(require('prime/es5/array'));
module.exports = {
    fileType : function(types){
        if(typeof types == 'string') types = types.split(',');
        return function(filename){
            if(array.contains(types, filename.split('.').pop())) return true;
            return false;
        }
    },
    fileTypeCaselessUpper : function(types){
        if(typeof types == 'string') types = types.split(',');
        return function(filename){
            if(array.contains(types, filename.split('.').pop().toUpperCase())) return true;
            return false;
        }
    },
    fileTypeCaselessLower : function(types){
        if(typeof types == 'string') types = types.split(',');
        return function(filename){
            if(array.contains(types, filename.split('.').pop().toLowerCase())) return true;
            return false;
        }
    }
}
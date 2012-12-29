var ext = require('./prime-ext');
var prime = ext(require('prime'));
var Class = require('Classy');
module.exports = new Class({
    configurations : {},
    getConfiguration : function(key){
        var parts = key.split('.');
        var current = this.configurations;
        while(parts.length > 0){
            current = current[parts.shift()];
            if(!current) return undefined;
        }
        return current;
    },
    setConfiguration : function(key, value){
        var parts = key.split('.');
        var current = this.configurations;
        while(parts.length > 0){
            var part = parts.shift();
            if(!current[part]) current[part] = {};
            current = current[part];
        }
        current = value;
    },
    loadConfiguration : function(file, callback){
        fs.readFile(file, 'utf8', fn.bind(function(err, data){
            if(err) throw('Cannot find configuration file');
            data = JSON.parse(data);
            data = prime.interleave(data, this.configurations);
            callback(data);
        }, this));
    }
});
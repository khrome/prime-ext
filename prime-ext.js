var prime = require('prime');
var type = require('prime/type');
var stringTool = require('string-tools');
var objectTool = require('async-objects');
var arrayTool = require('async-arrays');
module.exports = function(object){
    var map = {
        'prime' : ['has', 'create', 'each'],
        'types/number' : ['toExponential', 'toFixed', 'toPrecision', 'limit', 'round', 'times', 'random'],
        'types/string' : ['trim', 'clean', 'camelize', 'hyphenate', 'escape', 'number'],
        'es5/array' : ['filter', 'indexOf', 'map', 'forEach', 'every', 'some', 'isArray'],
        'es5/number' : ['toExponential', 'toFixed', 'toPrecision'],
        'es5/regexp' : ['test', 'exec'],
        'es5/string' : ['trim'],
        'es5/function' : ['apply', 'call', 'bind']
    }
    var getType = function(object){
        var result;
        prime.each(map, function(members, type){
            if(result) return;
            var passed = true;
            members.forEach(function(member){
                if(!object[member]) passed = false;
            });
            if(passed) result = type;
        });
        return result;
    };
    var keys = function(object){
        var result = [];
        for(var key in object) result.push(key);
        return result;
    }
    switch(getType(object)){
        case 'prime' :
            objectTool.on(object);
            break;
        case 'es5/array' :
            object.forEachEmission = arrayTool.forEachEmission;
            object.forAllEmissions = arrayTool.forAllEmissions;
            object.combine = arrayTool.combine;
            object.contains = arrayTool.contains;
            object.erase = arrayTool.erase;
            object.clone = function(arr){
                return objectTool.clone(arr);
            };
            break;
        case 'es5/function' :
            break;
        case 'types/number' :
        case 'es5/number' :
            break;
        case 'es5/regexp' :
            break;
        case 'types/string' :
        case 'es5/string' :
            
            object.startsWith = stringTool.startsWith;
            object.endsWith = stringTool.endsWith;
            object.startsWithAt = stringTool.startsWithAt;
            object.contains = stringTool.contains;
            object.multiLineAppend = stringTool.multiLineAppend;
            object.splitHonoringQuotes = stringTool.splitHonoringQuotes;
            object.decompose = stringTool.decompose;
            break;
    }
    return object;
};
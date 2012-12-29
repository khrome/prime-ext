var prime = require('prime');
var type = require('prime/util/type');
module.exports = function(object){
    var map = {
        'prime' : ['has', 'create', 'each'],
        'types/number' : ['toExponential', 'toFixed', 'toPrecision', 'limit', 'round', 'times', 'random'],
        'types/string' : ['trim', 'clean', 'camelize', 'hyphenate', 'escape', 'number'],
        'es5/array' : ['filter', 'indexOf', 'map', 'forEach', 'every', 'some', 'isArray'],
        'es5/function' : ['apply', 'call', 'bind'],
        'es5/number' : ['toExponential', 'toFixed', 'toPrecision'],
        'es5/regexp' : ['test', 'exec'],
        'es5/string' : ['trim']
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
    switch(getType(object)){
        case 'prime' :
            object.interleave = function(data, object){
                prime.each(data, function(item, key){
                    if(type(item) == 'object' && type(object[key]) == 'object') object[key] = prime.interleave(item, object[key]);
                    else object[key] = item;
                });
                return prime.clone(object);
            };
            object.keys = function(object){
                var result = [];
                for(var key in object) result.push(key);
                return result;
            };
            object.values = function(object){
                var result = [];
                for(var key in object) result.push(object[key]);
                return result;
            };
            object.clone = function(obj){
                var result;
                if(obj.clone && type(obj.clone) == 'function') return obj.clone();
                else 
                switch(type(obj)){
                    case 'object':
                        result = {};
                        for(var key in obj){
                            result[key] = prime.clone(obj[key]);
                        }
                        break;
                    case 'array':
                        result = obj.slice(0);
                        break;
                    default : result = obj;
                }
                return result;
            };
            object.merge = function(objOne, objTwo){
                var result = {};
                prime.each(objOne, function(item, key){
                    result[key] = item;
                });
                prime.each(objTwo, function(item, key){
                    if(!result[key]) result[key] = item;
                });
                return result;
            };
            break;
        case 'es5/array' :
            object.forEachEmission = function(collection, callback, complete){ //one at a time
                var a = {count : 0};
                var fn = function(collection, callback, complete){
                    if(a.count >= collection.length){
                        if(complete) complete();
                    }else{
                        callback(collection[a.count], a.count, function(){
                            a.count++;
                            fn(collection, callback, complete);
                        });
                    }
                };
                fn(collection, callback, complete);
            };
            object.forAllEmissions = function(collection, callback, complete){ //parallel
                var a = {count : 0};
                var begin = function(){
                    a.count++;
                };
                var finish = function(){
                    a.count--;
                    if(a.count == 0 && complete) complete();
                };
                array.forEach(collection, function(value, key){
                    begin();
                    callback(value, key, function(){
                       finish(); 
                    });
                });
            };
            object.combine = function(thisArray, thatArray){ //parallel
                var result = [];
                array.forEach(thatArray, function(value, key){
                    result.push(value);
                });
                return result;
            };
            object.contains = function(haystack, needle){ //parallel
                return haystack.indexOf(needle) != -1;
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
            object.startsWith = function(str, sub){
                return str.indexOf(sub) === 0; //likely more expensive than needed
            };
            object.endsWith = function(str, sub){
                return str.substring(str.length-sub.length) === sub;
            };
            break;
    }
    //console.log('prime', getType(object));
    return object;
};
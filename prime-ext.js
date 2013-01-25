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
            var clone = function(obj){
                if(!obj) return;
                var result;
                if(obj.clone && type(obj.clone) == 'function') return obj.clone();
                else 
                switch(type(obj)){
                    case 'object':
                        result = {};
                        for(var key in obj){
                            result[key] = clone(obj[key]);
                        }
                        break;
                    case 'array':
                        result = obj.slice(0);
                        break;
                    default : result = obj;
                }
                return result;
            };
            object.interleave = function(data, ob){
                ob = clone(ob);
                prime.each(data, function(item, key){
                    if(type(item) == 'object' && type(ob[key]) == 'object') ob[key] = prime.interleave(item, ob[key]);
                    else{
                        if((!ob[key])) ob[key] = item;
                    }
                });
                return ob;
            };
            object.union = function(data, ob){
                var res = {};
                prime.each(data, function(item, key){
                    if((ob[key] || ob[key] === false) && (item || item === false)){
                        if(type(item) == 'object' && type(ob[key]) == 'object') res[key] = prime.interleave(item, ob[key]);
                        else res[key] = item;
                    }
                });
                return res;
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
            object.clone = clone;
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
                object.forEach(collection, function(value, key){
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
            object.erase = function(arr, field){
                var index;
                while((arr.indexOf(field)) != -1){ //get 'em all
                    arr.splice(index, 1); //delete the one we found
                }
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
            object.startsWithAt = function(str, pos, sub){
                return str.indexOf(sub, pos-1) === pos;
            };
            object.splitHonoringQuotes = function(str, delimiter, quotes) {
                if(quotes == undefined) quotes = ['\'', '"'];
                var results = [];
                var inQuote = false;
                var quote = null;
                for(var lcv=0; lcv < str.length; lcv++){
                    if(inQuote){
                        if(str[lcv] == quote){
                            inQuote = false;
                            //results[results.length-1] += this[lcv];
                            //results[results.length] = '';
                        }else{
                            results[results.length-1] += str.charAt(lcv);
                        }
                    }else{
                        if(quotes.indexOf(str[lcv]) != -1){
                            quote = str[lcv];
                            //results[results.length-1] += this[lcv];
                            inQuote = true;
                        }else if(str[lcv] == delimiter){
                            results[results.length] = '';
                        }else{
                            results[results.length-1] += str.charAt(lcv);
                        }
                    }
                }
                return results;
            };
            break;
    }
    //console.log('prime', getType(object));
    return object;
};
var prime = require('prime');
module.exports = prime({
    working: 0,
    deferredWork : [],
    ready : function(){
        return !(this.working > 0);
    },
    addJob : function(job){
        this.working++;
    },
    removeJob : function(job){
        this.working--;
        if(this.working == 0 && this.deferredWork.length > 0){ //flush the queue
            var queue = this.deferredWork;
            this.deferredWork =[];
            queue.forEach(function(callback){
                callback();
            });
        }
        if(this.emit) this.emit('ready');
    },
    whenReady : function(callback){
        if(!this.ready()){
            this.deferredWork.push(callback);
        }else callback();
    }
});
define(['gnd'], function(Gnd) {
return Gnd.Util.extend(Gnd.Base, function(_super){
  var Todo = Gnd.Model.extend('todos');
  
  return {
    constructor : function TodoList(collection){
      var self = this;
      _super.constructor.call(self);

      self.set('collection', collection);
      
      self.collection.on('added: updated: removed:', function(todo) {
        self.update();
      });

      this.remaining = 0;
      this.completed = 0;
      this.itemsLeftString = 'items left';
      
      var todoListViewModel = new Gnd.ViewModel(Gnd.$('#todoapp')[0], {
        todolist: this,
        todos: collection
      });
      
      this.update();
    },
    
    update: function(){
      this.updateCompleted();
      this.updateCounter();
    },
    
    createTodo: function(args){
      var model = new Todo(args);
      this.collection.add(model);
      model.release();
    },
    
    //
    // Event Handlers
    //
    clearCompleted: function(node, evt){
      var itemIds = [];
      this.collection.each(function(item){
        if(item.completed){
          itemIds.push(item.id());
        }
      });
      for(var i=0; i<itemIds.length; i++){
        Gnd.Model.removeById(['todos', itemIds[i]], Gnd.Util.noop);
      }
      this.collection.remove(itemIds);
    },
    toggleAll: function(node, evt) {
      this.collection.each(function(todo) {
        todo.set('completed', node.checked);
      });
    },
    addTodo: function(node, evt) {
      if(evt.which === 13) {
        var description = Gnd.Util.trim(node.value);
        if ( description != '' ){
          node.value = '';
          this.createTodo({description : description});
        }
      }
    },
    removeTodo: function(node, evt){
      var 
        todoNode = node.parentNode.parentNode,
        todoId = todoNode.getAttribute('data-item');
      
      this.collection.remove(todoId);
      Gnd.Model.removeById(['todos', todoId], Gnd.Util.noop);
    },
    startEditing: function(node, evt){
      var todoNode = node.parentNode.parentNode;
      this._getTodoFromNode(todoNode).set('isEditing', true);
      Gnd.$('.edit', todoNode)[0].focus();
    },
    endEditing: function(node, evt){
      if(evt.which === 13 || evt.type === 'blur'){
        var todoNode = node.parentNode;
        this._getTodoFromNode(todoNode).set('isEditing', false);
      }
    },
    
    //
    // Stats updaters
    //
    updateCounter : function() {
      var itemsLeft = this.collection.filter(function(val) {
        return !val.completed;
      })
      this.set('remaining', itemsLeft.length);
      if(itemsLeft.length === 1){
        this.set('itemsLeftString', ' item left');
      } else {
        this.set('itemsLeftString', ' items left');
      }
    },
    updateCompleted : function(){
      var itemsCompleted = this.collection.filter(function(val){
        return val.completed;
      });
      this.set('completed', itemsCompleted.length);
      if(!itemsCompleted.length){
        this.set('allCompleted', false);
      } else if(itemsCompleted.length === this.collection.count){
        this.set('allCompleted', true);
      }
    },
    
    //
    // Filters
    //
    showAll: function(){
      this.collection.set('filterFn', null);
    },
    showCompleted: function(){
      this.collection.set('filterFn', function(item){
        return !!item.completed;
      });
    },
    showActive: function(){
      this.collection.set('filterFn', function(item){
        return !item.completed;
      });
    },
    
    //
    // Private
    //
    _getTodoFromNode: function(node){
      var todo = this.collection.find(function(item){
        return item.id() === node.getAttribute('data-item');
      });
      return todo;
    }
  }
  
})
});

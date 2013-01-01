define(['gnd'], function(Gnd) {
return Gnd.Util.extend(Gnd.Base, function(_super){
  var Todo = Gnd.Model.extend('todos');
  
  return {
    constructor : function TodoList(collection){
      var self = this;
      _super.constructor.call(self);

      self.set('collection', collection);
      
      self.collection.on('added: updated: removed:', function(todo) {
        self.updateCompleted();
        self.updateCounter();
      });
           
      this.remaining = 0;
      this.completed = 0;
      
      var todoListViewModel = new Gnd.ViewModel($('#todoapp')[0], {
        todolist: this,
        todos: collection
      });      
    },
    
    createTodo: function(args){
      var model = new Todo(args);
      this.collection.add(model);
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
      this.collection.remove(itemIds);
    },
    toggleAll: function(node, evt) {
      this.collection.each(function(todo) {
        todo.set('completed', node.checked);
      });
    },
    addTodo: function(node, evt) {
      if(evt.which === 13) {
        var description = $.trim(node.value);
        if ( description != '' ){
          node.value = '';
          this.createTodo({description : description});
        }
      }
    },
    removeTodo: function(node, evt){
      var todoNode = node.parentNode.parentNode;
      this.collection.remove(todoNode.getAttribute('data-item'));
    },
    startEditing: function(node, evt){
      var todoNode = node.parentNode.parentNode;
      var todo = this.collection.find(function(item){
        return item.id() === todoNode.getAttribute('data-item');
      });
      todo.set('isEditing', true);
    },
    endEditing: function(node, evt){
      if(evt.which === 13 || evt.type === 'blur'){
        var todoNode = node.parentNode;
        var todo = this.collection.find(function(item){
          return item.id() === todoNode.getAttribute('data-item');
        });
        todo.set('isEditing', false);
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
    },
    updateCompleted : function(){
      var itemsCompleted = this.collection.filter(function(val){
        return val.completed;
      });
      this.set('completed', itemsCompleted.length);
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
    }
  }
})
});

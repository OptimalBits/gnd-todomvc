curl(['gnd', 'js/controllers/todoList'], function(Gnd, TodoListCtrl) {
  var 
    Todo = Gnd.Model.extend('todos'),
    TodoList = Gnd.Model.extend('todolists'),
    todoList = new TodoList(),
    storageLocal  = new Gnd.Storage.Local();
    app = new Gnd.Base();
  
  Gnd.Model.storageQueue = new Gnd.Storage.Queue(storageLocal);
    
  function setFilter(all, active, completed){
    app.set('filterAll', all);
    app.set('filterActive', active);
    app.set('filterCompleted', completed);
  }
  
  setFilter(true, false, false);
  
  var appViewModel = new Gnd.ViewModel($('#filters')[0], {app: app});
  
  todoList.all(Todo, function(err, todos){
    var list = new TodoListCtrl(todos);
     
    list.createTodo({description: 'Write a book', completed: false});
    list.createTodo({description: 'Plant a tree', completed: true});
    list.createTodo({description: 'Coniferos', completed: true});
     
    Gnd.Route.listen(function(req) {
      req.get(function() {
        
        if(req.isLast()){
          list.showAll();
          setFilter(true, false, false);
        }
        
        req.get(':state', '', function() {
          var state = this.params.state;
          switch(state){
            case 'active': 
              list.showActive();
              setFilter(false, true, false);
              break;
            case 'completed': 
              list.showCompleted();
              setFilter(false, false, true);
              break;
          }
        });
      })
    })
  })
});
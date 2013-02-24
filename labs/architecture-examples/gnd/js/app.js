curl(['gnd', 'todoList'], function(Gnd, TodoListCtrl){
  var
    TODOLIST_ID = "GndTodoApp",
    Todo = Gnd.Model.extend('todos'),
    TodoList = Gnd.Model.extend('todolists'),
    todoList = new TodoList(),
    storageLocal  = new Gnd.Storage.Local();
    app = new Gnd.Base();
  
  //
  // Create a storageQueue using only a local storage
  //
  Gnd.Model.storageQueue = new Gnd.Storage.Queue(storageLocal);
  
  TodoList.findById(TODOLIST_ID, function(err, todoList){
    if(!todoList){
      todoList = new TodoList();
      
      // Force an ID so that we can find it easily next time the app starts
      todoList.id(TODOLIST_ID); 
      todoList.save();
    }

    // Keep the todo list synced so that Gnd automatically stores all the changes.
    todoList.keepSynced();
        
    function setFilter(all, active, completed){
      app.set('filterAll', all);
      app.set('filterActive', active);
      app.set('filterCompleted', completed);
    }
    setFilter(true, false, false);
  
    //
    // Bind the App model (only used for keeping the filter links updated)
    // (TODO: Only use one viewmodel for the whole APP)
    var appViewModel = new Gnd.ViewModel(document.getElementById('filters'), {app: app});
  
    //
    // Get the todos collection
    //
    todoList.all(Todo, function(err, todos){
      
      var todoListCtrl = new TodoListCtrl(todos);
     
      // 
      // Listen to available routes. Only used for selecting filters
      //
      Gnd.Route.listen(function(req) {
        req.get(function() {
        
          if(req.isLast()){
            todoListCtrl.showAll();
            setFilter(true, false, false);
          }
        
          req.get(':state', '', function() {
            var state = this.params.state;
            switch(state){
              case 'active': 
                todoListCtrl.showActive();
                setFilter(false, true, false);
                break;
              case 'completed': 
                todoListCtrl.showCompleted();
                setFilter(false, false, true);
                break;
            }
          });
        })
      })
    });
  });
});

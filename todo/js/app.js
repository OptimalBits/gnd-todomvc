curl( ['ginger', 
       'ginger/route',
       'js/controllers/todo',
       'js/controllers/todoList',
       'js/models/todo',] , function( ginger , route, todoView, todoList, Todo ) {
   
   var list;
   ginger.Collection.instantiate(Todo, [],function(err,collection){
     list = new todoList(collection, {});
     list.render($('#container'));
     list.createTodo( { description : 'Write a book' , completed : false } );
     list.createTodo( { description : 'Plant a tree' , completed : true } );
     list.createTodo( { description : 'Coniferos' , completed : true } );
   })
  route(function(req) {
    req.get(function() {
      req.get(':state', '', function() {
        var state = this.params.state;
        if( state == 'completed' ) {
          list.hideActive();
        } else {
          list.hideComplete();          
        }
        $('a', list.$filters).removeClass('selected').filter('[href="#/' + state + '"]').addClass('selected');
      });
    })
  })
});
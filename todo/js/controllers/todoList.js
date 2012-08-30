define( ['ginger',
         'js/models/todo',
         'js/controllers/todo'] , function( ginger , Todo , todoView) {
  var todoList = ginger.View.extend({
    constructor : function List(collection,options){
      this.super(List, 'constructor');

      var self = this;
      self.set('collection', collection);

      self.options = options;      

      self.$el = $('<section id="todoapp">');
      // Header
      self.$header = $('<header id="header"><h1>Todos</h1>');
      self.$headerInput = $('<input>',{id:"new-todo",placeholder:"What needs to be done?"}).appendTo(self.$header);
         
      // Main
      self.$main = $('<section id="main">');
      self.$toggleAll = $('<input>',{id:'toggle-all',type:'checkbox'}).appendTo( self.$main );
      $('<label for="toggle-all">Mark all as complete</label>').appendTo( self.$main );
      self.$todosContainer = $('<ul id="todo-list">').appendTo(self.$main);
         
      // footer
      self.$footer = $('<footer id="footer">');
      self.$todoCount = $('<span id="todo-count"><b>1</b>items left</span>').appendTo(self.$footer);
      self.$clearComplete = $('<button id="clear-completed">').hide().appendTo(self.$footer);
      self.$filters = $('<ul id="filters">').html('<li><a class="selected" href="#/">All</a></li><li><a href="#/active">Active</a></li><li><a href="#/completed">Completed</a></li>').appendTo(self.$footer);
      
      self.updateCounter();
      self.$el.append( self.$header , self.$main , self.$footer );

      $.each(self.collection.items,function(i,todo) {
      	todo.render(self.$todosContainer);
      })
      // events
      self.$headerInput.keyup(function( e ){
        if( e.which === 13 ) {
          var description = $.trim(self.$headerInput.val());
          if ( description != '' ) {
            var newtodo = { description : description };
            self.createTodo( newtodo );
            self.$headerInput.val('');
          }
        }
      })

      self.$toggleAll.on('click', function(){
        var inputEl = this;
        $.each( self.collection.items , function( i , todo ) {
          todo.set( 'completed' , inputEl.checked );
        })
      })
      self.$clearComplete.on( 'click' , function(){
        $.each( self.collection.items , function( i , todo ) {
          todo.$el.remove();
          todo.destroy();
        })
      })
      
      // listeners
      self.collection.on( 'added:' , function( todo ) {
      	self.add( todo )
        self.updateCounter();
      })
    },
    createTodo : function( data ) {
      var newtodo = new Todo( data );
      newtodo.keepSynced();
      this.collection.add( newtodo );
    },
    add : function( item ) {
      var self = this;
      var todo = new todoView( item );
      todo.render( this.$todosContainer );
      todo.on('completed',function(){
        self.updateCompleted();
      })
    },
    updateCounter : function() {
      var i = this.collection.items.length;
      switch ( i ) {
        case 0 : 
        this.$todoCount.html('<b>0</b> items left');
        case 1 :
        this.$todoCount.html('<b>1</b> item left');
        default :
        this.$todoCount.html('<b>' + i + '</b> item left');
      }
    },
    updateCompleted : function(){
      var count = 0;
      $.each(this.collection.items,function(i,todo) {
        if( todo.completed ) {
          count++;
        }
      })
      if( count ) {
        this.$clearComplete.text('Clear completed(' + count + ')').show();
      } else {
        this.$clearComplete.hide();
      }
    },
    hideComplete : function() {
      $( '.completed', this.$todosContainer ).hide();
      $( 'li' , this.$todosContainer ).not('.completed').show();
    },
    hideActive : function() {
      $( 'li' , this.$todosContainer ).not('.completed').hide();
      $( '.completed', this.$todosContainer ).show();
    },
    showAll : function() {
      $( 'li' , this.$todosContainer ).show();
    }
  })
  return todoList;
});
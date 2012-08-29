curl( ['ginger', 'ginger/route'] , function( ginger , route ) {
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
  var todoItem = ginger.View.extend({
    constructor : function Todo ( data ){
      this.super( Todo , 'constructor' );
      var self = this;
      var defaults = { description : "Todo description", completed : false };
      $.extend( {}, data, defaults );
      $.extend( self , data );
      
      self.$el = $('<li>');
      var $view = $('<div class="view">');
			
      self.$toggle = $('<input class="toggle" type="checkbox">').appendTo( $view );
      self.$label = $('<label>').text( self.description ).appendTo( $view );
      self.$destroy = $('<button class="destroy">').appendTo( $view );

      $view.appendTo( self.$el );
      self.$edit = $('<input class="edit">').val( self.description ).appendTo( self.$el );
      
      // listeners
      self.on('completed', function( completed ){
        if( completed ) {
          self.$toggle.attr( 'checked' , true );
          self.$el.addClass( 'completed' )
        } else { 
          self.$toggle.removeAttr( 'checked' , false );
          self.$el.removeClass( 'completed' )
        }
      })
      self.on('description', function( description ){
        self.$label.text( $.trim( description ) )
      })
      
      // events
      self.$toggle.on('click', function(){
        self.set('completed', this.checked);
      })
      self.$label.dblclick(function(){
        self.$el.addClass( 'editing' );
        self.$edit.focus();
        self.$edit.one('blur', function(){
          self.edit( self.$edit.val() );
        }).keyup(function( e ){
          if ( e.which === 13 ) {
            self.edit( self.$edit.val() );
          }
        })
      })
      self.$destroy.on('click',function(){
        self.$el.remove();
        self.destroy();
      })
	  },
    edit : function( description ) {
      if ( description ) {
        this.set('description', description )
      } else {
        // TODO: Destroy element
      }
      this.$el.removeClass( 'editing' );
    }
	})
  
  var todoList = ginger.View.extend({
    constructor : function List(collection,options){
      this.super(List, 'constructor');

      var self = this,
      $main;

      self.Collection = collection;
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

      $.each(collection.items,function(i,todo) {
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
        $.each( collection.items , function( i , todo ) {
          todo.set( 'completed' , inputEl.checked );
        })
      })
      self.$clearComplete.on( 'click' , function(){
        $.each( collection.items , function( i , todo ) {
          todo.$el.remove();
          todo.destroy();
        })
      })
      // listeners
      collection.on( 'added:' , function( todo ) {
      	self.add( todo )
        self.updateCounter();
      })
    },
    createTodo : function( data ) {
      var newtodo = new Todo( data );
      newtodo.keepSynced();
      this.Collection.add( newtodo );
    },
    add : function( item ) {
      var self = this;
      var todo = new todoItem( item );
      todo.render( this.$todosContainer );
      todo.on('completed',function(){
        self.updateCompleted();
      })
    },
    updateCounter : function() {
      var i = this.Collection.items.length;

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
      $.each(this.Collection.items,function(i,todo) {
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
  
  var Todo = ginger.Declare( ginger.Model );
  Todo.bucket( 'todo' );
  
  var list;
  ginger.Collection.instantiate(Todo, [],function(err,collection){
    list = new todoList(collection, {});
    list.render($('#container'));
    list.createTodo({description:'write a book',completed:false});
  })
});
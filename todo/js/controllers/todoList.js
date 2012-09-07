define( ['ginger',
         'js/models/todo',
         'js/controllers/todo'] , function( ginger , Todo , todoView) {
  var todoList = ginger.View.extend({
    constructor : function List(collection){
      this.super(List, 'constructor');
  
      var self = this;
      self.set('collection', collection);
      
      this.$el = $('#todoapp');
      this.statsTemplate = _.template( $('#stats-template').html() );
      
      self.$headerInput = $('#new-todo');
      self.$toggleAll = $('#toggle-all');
      self.$clearComplete = $('#clear-completed');
      self.$todosContainer = $('#todo-list');
      
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
        self.updateCounter();
      })
      self.collection.on( 'updated: removed:' , function( todo ) {
        self.updateCompleted();
        self.updateCounter();
      })
    },
    render : function( parent ) {
      /*$.each(self.collection.items,function(i,todo) {
      	todo.render(self.$todosContainer);
      })*/

			$('#footer').html(this.statsTemplate({
				completed: 0,
				remaining:1
			}));
      this.$todoCount = $('#todo-count');
    },
    createTodo : function( data ) {
      var model = new Todo( data );
      model.keepSynced();
      this.collection.add( model );
      var view = new todoView( model );
      view.render( this.$todosContainer );
      var self = this;
      
      view.on('completed',function(){
        self.updateCompleted();
      })
     /* var todoView = new todoView( todo );
      todo.render( this.$todosContainer );
      todo.on('completed',function(){
        self.updateCompleted();
      })*/
    },
    add : function( model ) {
      var self = this;
      var todo = new todoView( model );
      todo.render( this.$todosContainer );
      todo.on('completed',function(){
        self.updateCompleted();
      })
    },
    updateCounter : function() {
      var itemsLeft = this.collection.filter(function( val ) {
        return !val.completed;
      })
      switch ( itemsLeft ) {
        case 1 :
          this.$todoCount.html('<b>1</b> item left');
          break;
        default :
          this.$todoCount.html('<b>'+ itemsLeft.length +'</b> items left');
      }
    },
    updateCompleted : function(){
      var itemsCompleted = this.collection.filter(function( val ) {
        return val.completed;
      })
      if( itemsCompleted ) {
        this.$clearComplete.show();
      }
    },
    hideComplete : function() {

    },
    hideActive : function() {

    },
    showAll : function() {

    }
  })
  return todoList;
});
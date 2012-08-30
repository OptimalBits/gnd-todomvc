define( ['ginger'] , function( ginger ) {
  var todo = ginger.View.extend({
    constructor : function Todo ( data ){
      this.super( Todo , 'constructor' );
      var self = this;
      var defaults = { description : "Todo description", completed : false };
      $.extend( {}, data, defaults );
      $.extend( self , data );
      
      self.$el = $('<li>');
      var $view = $('<div class="view">');
			
      self.$toggle = $('<input class="toggle" type="checkbox">').attr( 'checked' , self.completed ).appendTo( $view );
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
      });
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
  return todo;
});
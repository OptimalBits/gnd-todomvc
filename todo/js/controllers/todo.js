define( ['ginger'] , function( ginger ) {
  var todoView = ginger.View.extend({
    constructor : function Todo ( model ){
      this.super( Todo , 'constructor' );
      var self = this;
      self.model = model;
      
      self.$el = $('<li>');
      
      self.todoTemplate = _.template( $('#item-template').html() );

      // listeners
      self.model.on('completed', function( completed ){
        if( completed ) {
          self.$toggle.attr( 'checked' , true );
          self.$el.addClass( 'completed' )
        } else { 
          self.$toggle.removeAttr( 'checked' , false );
          self.$el.removeClass( 'completed' )
        }
      })
      self.model.on('description', function( description ){
        self.$label.text(description);
      })
      self.model.on('removed:', function( description ){
        self.$el.remove();
      })
      
      // delegates
      self.$el.on('click','.toggle', function(){
        self.model.set('completed', this.checked);
      });
      
      self.$el.on('dblclick', 'label', function(){
        self.$el.addClass( 'editing' );
        self.$input.focus();
        self.$input.one('blur', function(){
          self.edit( self.$input.val() );
        }).keyup(function( e ){
          if ( e.which === 13 ) {
            self.edit( self.$input.val() );
          }
        })
      })
      
      self.$el.on('click', '.destroy', function(){
        self.$el.remove();
        self.model.delete();
      })
	  },
    render : function( parent ) {
      this.$el.html(this.todoTemplate({
				description : this.model.description,
				completed : this.model.completed
			})).appendTo(parent);
      if( this.model.completed ) {
        this.$el.addClass('completed');
      }
      this.$input = $('.edit', this.$el );
      this.$label = $('label', this.$el );
      this.$toggle = $('.toggle', this.$el );
    },
    edit : function( description ) {
      if ( description ) {
        this.model.set('description', description )
      } else {
        // TODO: Destroy element
      }
      this.$el.removeClass( 'editing' );
    }
	})
  return todoView;
});
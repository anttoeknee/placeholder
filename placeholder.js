(function($){

	/*/// Placeholder fields ///*/

	$.fn.placeholder = function(method) {

		// has a method has been passed in?
		if (methods[method]) {

			// call this method with arguments that may have been passed in
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		// if just options have been passed in, or no method...
		} else if (typeof method === 'object' || !method) {

			// call the init method
			return methods.init.apply(this, arguments);

		} else {

			// throw an error
			$.error( 'Method ' +  method + ' does not exist on jQuery.placeholder');
		}

	};

	var properties = {
		fields : []
	}

	var methods = {

		init: function(options) {

			// define defaults
			var settings = {
				override : false
			}

			// merge passed options into defaults
			if (options) { 
		        $.extend(settings, options);
		    }

		    /* 
		    	Only run the code if the browser doesn't support placeholders
		    	or if we explicity tell it to via the override option
		    */

		    if (!Modernizr.input.placeholder || settings.override) {
		    	
		    	// put all placeholder fields into fields proprty
				properties.fields = this.find('*[placeholder]');

				// bind events
				//properties.fields.bind('focus.placeholder', methods.hide);
				properties.fields.bind('keyup.placeholder', methods.check_length);
				properties.fields.bind('keydown.placeholder', methods.clear_input);
				properties.fields.bind('blur.placeholder', methods.show);
				properties.fields.bind('focus.placeholder', function() {
					if ($(this).val() == $(this).attr('placeholder')) {
						var range = $(this)[0].createTextRange();
			            range.move('character', 0);
			            range.select();
			        }
				});

				// show
				methods.show(true);

			}

		},

		show: function(all_fields) {

			if (all_fields === true) {

				// Populate fields with 'placeholder' values
				for (var i = 0; i < properties.fields.length; i++) {

					var field = $(properties.fields[i]);
					field.val(field.attr('placeholder'));

					if (field.attr('type') == 'password') {
						methods.password_overlay(field);
					}

				} 

			} else {

				var input = all_fields.type != undefined ? $(this) : all_fields;
				
				// If the current value is blank
				if (input.val().length <= 0) {

					// Put original value in field
					input.val(input.attr('placeholder'));

					if (input.attr('type') == 'password') {
						methods.password_overlay(input);
					}

					input.focus();
				}

			}

		},

		hide: function(all_fields) {

			if (all_fields === true) {

				for (var i = 0; i < properties.fields.length; i++) {

					var field = $(properties.fields[i]);
					field.val('');

				}

			} else {

				var input = all_fields || $(this);

				// If the current value is the 'placeholder' value
				if (input.val() == input.attr('placeholder')) {

					// remove value from field
					input.val('');
					console.log('clear field');
				}
			}
			
		},

		clear_input: function(event) {

			if (event.keyCode != 9) {

				methods.hide($(this));

			}

		},

		check_length: function(event) {

			if (event.keyCode != 9) {
	
				methods.show($(this));
			
			}

		},

		password_overlay: function(field) {

			/* 
				type is password so add a span over the field with the 
				placeholder value (because the type attr cannot be changed)
			*/

			var styles = methods.computed_styles(field);
			
			// build span
			var input = $('<input type="type" value="' + field.attr('placeholder') + '" />');
			input.addClass('password');
			input.css(styles);

			input.insertAfter(field);
			field.css('display', 'none');

			input.bind('focus.placeholder', function() {
				if (input.val() == field.attr('placeholder')) {
					var range = $(this)[0].createTextRange();
		            range.move('character', 0);
		            range.select();
		        }
			});

			input.bind('keydown.placeholder', function() {
				input.css('display', 'none');
				field.css('display', 'block');
				field.val('');
				field.focus();
			});
			
		},

		/* START: Credit to 'http://upshots.org/?p=112' for getStyleObject */

		camelize: function(a,b) {
			return b.toUpperCase();
		},

		computed_styles: function(element) {

			var dom = element;
        	var style;
        	var returns = {};

	        if (window.getComputedStyle) {
	           
	            style = window.getComputedStyle(dom, null);

	            for (var i = 0, l = style.length; i < l; i++) {
	                var prop = style[i];
	                var camel = prop.replace(/\-([a-z])/g, methods.camelize);
	                var val = style.getPropertyValue(prop);
	                returns[camel] = val;
	            };

	            return returns;
	        }

	        if (style = dom.currentStyle) {
	            for(var prop in style){
	                returns[prop] = style[prop];
	            }

	            return returns;
	        }

	        return returns;
		}

		/* END: Credit to 'http://upshots.org/?p=112' for getStyleObject */

	};

})(jQuery);
/*
	placeholder: Anthony Armstrong
		version: 1.0.0
		last modified: 2013-01-04
*/

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
				properties.fields.bind('focus.placeholder', methods.hide);
				properties.fields.bind('blur.placeholder', methods.show);

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

				// If the current value is blank
				if ($(this).val() == ' ' || $(this).val() == '') {

					// Put original value in field
					$(this).val($(this).attr('placeholder'));

					if ($(this).attr('type') == 'password') {
						methods.password_overlay($(this));
					}
				}

			}

		},

		hide: function(all_fields) {

			if (all_fields === true) {

				for (var i = 0; i < properties.fields.length; i++) {

					var field = $(properties.fields[i]);
					field.val(' ');

				}

			} else {

				// If th current value is not the 'placeholder' value
				if ($(this).val() == $(this).attr('placeholder')) {

					// remove value from field
					$(this).val(' ');
				}
			}
			
		},

		password_overlay: function(field) {

			/* 
				type is password so add a span over the field with the 
				placeholder value (because the type attr cannot be changed)
			*/

			var styles = field.getStyleObject();
			
			// build span
			var span = $('<span>' + field.attr('placeholder') + '</span>');
			span.addClass('password');
			span.css(styles);

			span.insertAfter(field);
			field.css('display', 'none');

			span.bind('focus', function() {
				span.css('display', 'none');
				field.css('display', 'block');
				field.focus();
			});
			
		}

	};

})(jQuery);
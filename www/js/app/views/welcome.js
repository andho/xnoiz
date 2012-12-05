define(['jquery', 'backbone', 'text!templates/welcome.html'],
function(jquery, Backbone, template) {

	var WelcomeView = Backbone.View.extend({
		el: 'body',

		events: {
			'submit form#setupform': 'start'
		},

		render: function() {
			$(this.el).html(template);

			$('#name', this.el).get(0).focus();
		},

		start: function(e) {
			e.preventDefault();
			this.trigger('start', $('#name', this.el).val());
		},

	});

	return WelcomeView;
});
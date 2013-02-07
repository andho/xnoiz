define(['jquery', 'backbone', 'underscore', 'text!templates/chat/message.html'],
function($, Backbone, _, template) {
	var MessageListView = Backbone.View.extend({

		tag: 'ul',

		template: _.template(template),

		render: function() {

		},

		appendMessage: function(msg) {
			var msghtml = this.template(msg);

			$(this.el).append(msghtml);
		},

	});

	return MessageListView;
});
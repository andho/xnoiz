define(['jquery', 'backbone', 'underscore', 'app/models/chat', 'text!templates/chat/main.html', 'app/views/chat/chat'],
function(jquery, Backbone, _, Chat, template, ChatView) {
	var ChatMainView = Backbone.View.extend({
		el: 'body',

		template: _.template(template),

		initialize: function() {
			this.bind('create', this.create, this);

			this.model.bind('add', this.newChat, this);
			this.model.bind('remove', this.removeChat, this);
			this.model.bind('change', this.moveChat, this);
		},

		render: function() {
			$(this.el).html(this.template({name: this.options.name}));

			this.trigger('create');
		},

		newChat: function(chat) {
			var view = new ChatView({model: chat});
			$('#chat-container', this.el).append(view.el);
			view.render();
		},

		create: function() {
			var chat = new Chat.Model();
			chat.addParticipant(this.options.name);
			this.model.add(chat, {silent: true});

			var self = this;
			chat.save(null, {success: function(data) {
				self.model.trigger('add', chat);
			}});
		},

	});

	return ChatMainView;
});
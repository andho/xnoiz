define(['jquery', 'backbone', 'underscore',
	'app/models/participant',
	'app/models/chat', 'text!templates/chat/main.html', 'app/views/chat/chat'],
function(jquery, Backbone, _, Participant, Chat, template, ChatView) {
	var ChatMainView = Backbone.View.extend({
		el: 'body',

		template: _.template(template),

		initialize: function() {
			this.bind('create', this.create, this);

			this.model.bind('add', this.newChat, this);
			this.model.bind('remove', this.removeChat, this);
			this.model.bind('change', this.moveChat, this);

			this.participants = this.options.participants;
		},

		render: function() {
			$(this.el).html(this.template({name: this.options.name}));

			this.trigger('create');
		},

		newChat: function(chat) {
			chat.bindCQRS();
			var view = new ChatView({
				model: chat,
				participants: Participant.Collection()
			});
			$('#chat-container', this.el).append(view.el);
			view.render();
		},

		create: function() {
			new Backbone.CQRS.Command({
				name: 'createChat',
				payload: {
					id: 1
				}
			}).emit();
		},



	});

	return ChatMainView;
});
define(['jquery', 'backbone', 'underscore',
	'app/models/participant',
	'app/models/chat', 'text!templates/chat/main.html', 'app/views/chat/chat'],
function(jquery, Backbone, _, Participant, Chat, template, ChatView) {
	var ChatMainView = Backbone.View.extend({
		el: 'body',

		template: _.template(template),

		events: {
			"click #join-chat": "joinChat"
		},

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

		joinChat: function() {
			var _this = this;
			var id = $('#chat-name', this.el).val();
			if (id == '') {
				alert("Please input an id");
				return;
			}

			$.ajax({
				url: 'chat/'+id,
				dataType:'json',
				success: function(chat) {
					var participants = new Participant.Collection();
					participants.add(chat.user);
					participants.add({name: _this.name});
					var chat = new Chat.Model({
						id: chat.id,
						messages: chat.messages,
						participants: participants
					});

					_this.model.add(chat);
				}
			});
		},

		create: function() {
			new Backbone.CQRS.Command({
				name: 'createChat',
				payload: {
					id: Math.floor(Math.random()*1000000)
				}
			}).emit();
		},



	});

	return ChatMainView;
});
define(['jquery', 'backbone', 'underscore', 'text!templates/chat/chat.html',
	'app/views/chat/messages', 'app/models/message', 'text!templates/chat/participant.html'
], function($, Backbone, _, template, MessagesListView, Message, participantTemplate) {
	var ChatView = Backbone.View.extend({

		template: _.template(template),

		events: {
			'submit form.inputform': 'sendMessage'
		},

		initialize: function() {
			this.messages = new Message.Collection();
		},

		render: function() {
			console.log(this.model);
			$(this.el).html(this.template({id: this.model.cid}));

			$('#msgtxt', this.el).get(0).focus();
			this.bind(this.model.cid+':messagesent', this.addMessage, this);

			var messagesView = new MessagesListView();
			this.messages.bind('add', messagesView.appendMessage, messagesView);

			$('.messages', this.el).html(messagesView.el);

			var participantsListView = new ParticipantsListView();
			this.model.get('participants').bind('add', participantsListView.addParticipant, participantsListView);
			$('.participants', this.el).html(participantsListView.el);
		},

		sendMessage: function(e) {
			e.preventDefault();
			var msg = $('#msgtxt').val();

			this.trigger(this.model.cid+':messagesent', msg);
		},

		addMessage: function(msg) {
			var msg = new Message.Model({
				message: msg,
				chat: this.model.id
			});
			this.messages.add(msg);

			msg.save();
		},

		addParticipant: function(participant) {
			this.model.addParticipant(participant);
		}

	});

	var ParticipantsListView = Backbone.View.extend({

		tagName: 'ul',

		template: _.template(participantTemplate),

		render: function() {

		},

		addParticipant: function(participant) {
			var participanthtml = this.template(participant.toJSON());

			$(this.el).append(participanthtml);
		},

	});

	return ChatView;
});
define(['backbone'], function(Backbone) {
	
	var Chat = Backbone.Model.extend({

		initialize: function () {
			this.messages = [];
			this.modelName = 'chat';
			this.participants = [];
		},

		apply: function(evt) {
			console.log(arguments);
			if (evt.name == 'messageSent') {
				this.handleMessageSent(evt);
			}
		},

		handleMessageSent: function(evt) {
			var msg = evt.get('payload');
			this.messages.push(msg);
			this.trigger('messageAdded', msg);
		}
	});

	var ChatCollection = Backbone.Collection.extend({
		model: Chat,
	});

	var chats = new ChatCollection();

	var ChatCreatedHandler = new Backbone.CQRS.EventDenormalizer({
		forModel: 'chat',
		forEvent: 'chatCreated',

		methode: 'create',
		model: Chat,
		collection: chats
	});


	var MessageSentHandler = Backbone.CQRS.EventDenormalizer.extend({
		parse: function(evt) {
			console.log(evt);
			return evt;
		}
	});

	var messageSendHandler = new MessageSentHandler({
		forModel: 'chat',
		forEvent: 'messageSent',
	});

	return {
		Collection: chats
	};

});
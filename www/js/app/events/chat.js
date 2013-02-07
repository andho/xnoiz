define(['backbone', 'models/chat'], function(Backbone, Chat) {
	var ChatCreatedDenormalizer = Backbone.CQRS.EventDenormalizer({
		methode: 'create',
		model: Chat.Model,
		collection: Chat.Collection,

		forModel: 'person',
		forEvent: 'personCreated'
	});

	return {
		ChatCreated
	};
});
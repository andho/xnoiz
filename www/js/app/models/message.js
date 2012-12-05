define(['backbone'], function(Backbone) {
	
	var Message = Backbone.Model.extend({

	});

	var MessageCollection = Backbone.Collection.extend({
		model: Message,
		url: '/messages'
	});

	return {
		Model: Message,
		Collection: MessageCollection
	};

});
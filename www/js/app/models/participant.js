define(['backbone'], function(Backbone) {
	
	var Participant = Backbone.Model.extend({

	});

	var ParticipantCollection = Backbone.Collection.extend({
		model: Participant
	});

	return {
		Model: Participant,
		Collection: ParticipantCollection
	};

});
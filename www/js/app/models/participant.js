define(['backbone'], function(Backbone) {
	
	var Participant = Backbone.Model.extend({
		modelName: 'participant'
	});

	var ParticipantCollection = Backbone.Collection.extend({
		model: Participant
	});

	var PersonChangedHandler = Backbone.CQRS.EventDenormalizer.extend({
		forModel: 'participant',
		forEvent: 'personChanged',

		methode: 'create',
		model: Participant
	});

	return {
		Collection: function() {
			var participants = new ParticipantCollection();

			var personChangedHandler = new PersonChangedHandler({
				collection: participants
			});

			return participants;
		}
	};

});
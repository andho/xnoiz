define(['backbone'], function(Backbone) {
	
	var Chat = Backbone.Model.extend({
		initialize: function() {
			var participants = new ParticipantCollection();
			this.set('participants', participants);
			this.participants = participants;
		},

		addParticipant: function(participant) {
			var participant = new Participant({name: participant});
			this.participants.add(participant);
		},


	});

	var ChatCollection = Backbone.Collection.extend({
		model: Chat,
		url: '/chats'
	});

	var Participant = Backbone.Model.extend({

	});

	var ParticipantCollection = Backbone.Collection.extend({
		model: Participant
	});

	return {
		Model: Chat,
		Collection: ChatCollection
	};

});
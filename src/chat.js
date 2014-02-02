function Chat(id, owner) {
	var e = {
		name: 'chatCreated',
		payload: {
			id: id,
			owner: owner
		}
	};

	EventSourced.apply(this);

	this.applyEvent(e);
}

Chat.prototype = new EventSourced;
Chat.prototype.constructor = Chat;

Chat.prototype.applyChatCreated = function(e) {
	var owner = e.payload.owner;

	this.id = e.payload.id;
	this.owner = owner;
	this.participants = [owner];

	this.participantsMap = {};
	this.participantsMap[owner.id] = owner;

	this.messages = [];
};

Chat.prototype.getParticipants = function() {
	return this.participants;
};

Chat.prototype.getMessages = function() {
	return this.messages;
};

Chat.prototype.addMessage = function(user, message) {
	if (!this.participantsMap[user.id]) {
		throw new Error("User with id '"+user.id+"' is not a participant");
	}

	this.applyEvent({
		name:'messageAdded',
		payload: {
			user: user,
			message: message
		}
	});
};

Chat.prototype.applyMessageAdded = function(e) {
	this.messages.push(e.payload.message);
};

Chat.prototype.addParticipant = function(user) {
	if (this.participantsMap[user.id]) {
		throw new Error("User with id '"+user.id+"' is already a participant");
	}

	this.applyEvent({
		name: 'participantAdded',
		payload: {
			user: user
		}
	});
};

Chat.prototype.applyParticipantAdded = function(e) {
	var user = e.payload.user;
	this.participants.push(user.id);
	this.participantsMap[user.id] = user;
};

exports.Chat = Chat;

function EventSourced() {
	this._unsavedEvents = [];
	this._listeners = {};
}

EventSourced.prototype.applyEvent = function(e) {
	this._unsavedEvents.push(e);

	var applyMethod = 'apply'+e.name.charAt(0).toUpperCase()+e.name.slice(1);
	if (!this[applyMethod]) {
		throw new Error("No such method: " + applyMethod);
	}

	this[applyMethod](e);

	this.emitEvent(e.name, e);
};

EventSourced.prototype.emitEvent = function(name, e) {
	if (!this._listeners[name]) {
		return;
	}

	for (var i=0; i<this._listeners[name].length; i++) {
		var listener = this._listeners[name][i];
		listener(e);
	}
};

EventSourced.prototype.addListener = function(eventName, callback, context) {
	if (context) {
		callback.bind(context);
	}

	if (!this._listeners[eventName]) {
		this._listeners[eventName] = [];
	}
	this._listeners[eventName].push(callback);
}
var should = require('should');

var Chat = require('../src/chat').Chat;

describe('Chat', function() {
	var chat
	beforeEach(function() {
		chat = new Chat(1, {id: 1, name: 'amjad'});
	});
	
	describe('when created', function() {
		it('has one participant', function() {
			chat.getParticipants().length.should.equal(1);
		});
		it('has no messages', function() {
			chat.getMessages().length.should.equal(0);
		});
	});

	describe('when message is sent', function() {
		it('has 1 message', function() {
			chat.addMessage({id: 1, name: 'amjad'}, 'hello');
			chat.getMessages().length.should.equal(1);
		});

		it('complains when message is sent by non participant', function() {
			try {
				chat.addMessage({id: 2, name: 'mohamed'}, 'hello');
				throw Error("Chat didn't complain about message from non-participant");
			} catch (e) {
				e.message.should.equal("User with id '2' is not a participant");
			}
		});

		it("emits 'messageAdded' event", function() {
			chat.addListener('messageAdded', function(e) {
				e.name.should.equal('messageAdded');
			});
			
			chat.addMessage({id: 1, name: 'amjad'}, 'hello');
		});
	});

	describe('when a new participant is added', function() {
		it ('increases the participant count', function() {
			chat.addParticipant({id: 2, name: 'mohamed'});
			chat.getParticipants().length.should.equal(2);
		});

		it('complains if the participant already exists', function() {
			try {
				chat.addParticipant({id: 1, name: 'amjad'});
			} catch (e) {
				e.message.should.equal("User with id '1' is already a participant");
			}
		});
	});
});
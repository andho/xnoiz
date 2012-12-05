define(['backbone', 'app/views/welcome', 'app/views/chat/main', 'app/models/chat'],
function(Backbone, WelcomeView, ChatView, Chat) {

	var chats = new Chat.Collection();

	var Router = Backbone.Router.extend({

		routes: {
			'': 'welcome'
		},

		initialize: function() {
			Backbone.history.start();
		},

		welcome: function() {
			var view = new WelcomeView();
			view.bind('start', this.start, this);
			view.render();
		},

		start: function(name) {
			var view = new ChatView({model: chats, name: name});

			view.render();
		},

	});

	return Router;
});
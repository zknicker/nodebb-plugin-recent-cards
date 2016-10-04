"use strict";

var plugin = {},
	async = module.parent.require('async'),
	topics = module.parent.require('./topics'),
	settings = module.parent.require('./settings'),
	groups = module.parent.require('./groups'),
	socketAdmin = module.parent.require('./socket.io/admin'),
	emitter = module.parent.require('./emitter'),
	defaultSettings = { title: 'Recent Topics', opacity: '1.0', textShadow: 'none', enableCarousel: 0, enableCarouselPagination: 0 };

plugin.init = function(params, callback) {
	var app = params.router,
		middleware = params.middleware;

	app.get('/admin/plugins/splashrecentposts', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/plugins/splashrecentposts', renderAdmin);

	plugin.settings = new settings('splashrecentposts', '1.0.0', defaultSettings);

	socketAdmin.settings.syncSplashRecentPosts = function () {
		plugin.settings.sync();
	};

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/splashrecentposts',
		icon: 'fa-tint',
		name: 'Splash Recent Posts'
	});

	callback(null, header);
};

plugin.getCategories = function(data, callback) {

	function renderRecentPosts(err, topics) {
		if (err) {
			return callback(err);
		}

		var i = 0, cids = [], finalTopics = [];
		
		if (!plugin.settings.get('enableCarousel')) {
			while (finalTopics.length < 4 && i < topics.topics.length) {
				var cid = parseInt(topics.topics[i].cid, 10);

				if (cids.indexOf(cid) === -1) {
					cids.push(cid);
					finalTopics.push(topics.topics[i]);
				}

				i++;
			}
		} else {
			finalTopics = topics.topics;
		}

		data.templateData.topics = finalTopics;
		data.templateData.headerTopics = finalTopics.slice(0,3);
		data.templateData.splashRecentPosts = {
			title: plugin.settings.get('title'),
			opacity: plugin.settings.get('opacity'),
			textShadow: plugin.settings.get('shadow'),
			enableCarousel: plugin.settings.get('enableCarousel'),
			enableCarouselPagination: plugin.settings.get('enableCarouselPagination')
		};

		callback(null, data);
	}

	if (plugin.settings.get('groupName')) {
		groups.getLatestMemberPosts(plugin.settings.get('groupName'), 19, data.req.uid, function(err, posts) {
			var topics = {topics: []};
			for (var p = 0, pp = posts.length; p < pp; p++) {
				var topic = posts[p].topic;
				topic.category = posts[p].category;
				topics.topics.push(topic);
			}

			renderRecentPosts(err, topics);
		});
	} else {
		topics.getTopicsFromSet('topics:recent', data.req.uid, 0, 19, renderRecentPosts);
	}
};

function renderAdmin(req, res) {
	var list = [];

	groups.getGroups('groups:createtime', 0, -1, function(err, groups) {
		groups.forEach(function(group) {
			if (group.match(/cid:([0-9]*):privileges:groups:([\s\S]*)/) !== null) {
				return;
			}

			list.push({
				name: group,
				value: group
			});
		});

		res.render('admin/plugins/splashrecentposts', {groups: list});
	});	
}

module.exports = plugin;
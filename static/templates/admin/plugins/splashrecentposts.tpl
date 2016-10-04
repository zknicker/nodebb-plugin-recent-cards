<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Splash Recent Posts</div>
			<div class="panel-body">
				<form role="form" id="splashrecentposts">
					<div class="form-group">
						<label for="title">Title</label>
						<input type="text" id="title" data-key="title" title="title" class="form-control" placeholder="Recent Topics">
					</div>

					<div class="form-group">
						<label for="groupName">Optional: Select posts posted from a certain group only</label>
						<select class="form-control" id="groupName" name="groupName" data-key="groupName">
							<option value="">N/A</option>
							<!-- BEGIN groups -->
							<option value="{../name}">{../value}</option>
							<!-- END groups -->
						</select>
					</div>

					<div class="form-group">
						<label for="opacity">Background Opacity</label>
						<input type="text" id="opacity" data-key="opacity" title="opacity" class="form-control" placeholder="1.0">
					</div>
					<div class="form-group">
						<label for="shadow">Text Shadow</label>
						<input type="text" id="shadow" data-key="shadow" title="shadow" class="form-control" placeholder="none">
					</div>

					<div class="form-group">
						<div class="checkbox">
							<label for="enableCarousel">
								<input type="checkbox" data-key="enableCarousel" id="enableCarousel" name="enableCarousel" />
								Enable Carousel Mode
							</label>
						</div>

						<div class="checkbox">
							<label for="enableCarouselPagination">
								<input type="checkbox" data-key="enableCarouselPagination" id="enableCarouselPagination" name="enableCarouselPagination" />
								Turn on paginator for carousel
							</label>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
require(['settings'], function(settings) {

	settings.sync('splashrecentposts', $('#splashrecentposts'));

	$('#save').click( function (event) {
		settings.persist('splashrecentposts', $('#splashrecentposts'), function(){
			socket.emit('admin.settings.syncsplashrecentposts');
			app.alertSuccess('Please restart your forum for changes to fully take effect.');
		});
	});
});
</script>
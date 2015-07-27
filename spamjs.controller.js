_define_({
	name : "spamjs.controller",
	modules : [ "jqrouter", "_","jsutils.file"]
}).as(function(CONTROLLER, ROUTER, _, FILEUTILS) {

	return {
		htmlroot : undefined,
		routerMap : {
		},
		_instance_ : function(options) {
			this.$context = options.$context;
			this.id = options.id;
			this.router = options.router;
			this.initRouting();
		},
		initRouting : function() {
			var self = this;
			self.router = self.router || ROUTER.instance();
			_.each(this.routerMap, function(key, url) {
				self.router.on(url, function(param){
					var result = key;
					if(is.Function(self[key])){
						result = self[key].apply(self,arguments);
					}
					jQuery.when(result).done(function(resp){
						if(is.String(resp)){
							if(self.htmlroot!==undefined){
								FILEUTILS.getHTML(self.path(self.htmlroot)+resp).done(function(respHTML){
									self.$context.html(respHTML);
								});
							} else {
								var viewModule = module(resp);
								if(viewModule){
									viewModule.id=self.id;
									viewModule.instance({ params : self.router.getParams()}).addTo(self.$context);
								}
							}
						} else if(resp && is.Function(resp.addTo)){
							var moduleInstance;
							if(resp.__view_id__){
								moduleInstance = resp;
							} else {
								moduleInstance = res.instance({ params : self.router.getParams()});
							}
							moduleInstance.id=self.id;
							moduleInstance.addTo(self.$context);
						}
					});
				});
			});
		}
	};
});
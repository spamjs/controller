_define_({
	name : "spamjs.controller",
	modules : [ "jqrouter", "_","jsutils.file"]
}).as(function(CONTROLLER, ROUTER, _, FILEUTILS) {

	return {
		htmlroot : undefined,
		routerMap : {
		},
		_instance_ : function($context) {
			this.$context = $context;
			this.initRouting();
		},
		initRouting : function() {
			var self = this;
			self.__router__ = ROUTER.instance();
			_.each(this.routerMap, function(key, url) {
				self.__router__.on(url, function(param){
					var result = key;
					if(is.Function(self[key])){
						result = self[key].apply(self.arguments);
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
									viewModule.instance().addTo(self.$context);
								}
							}
						} else if(res.addTo){
							var moduleInstance;
							if(resp.__view_id__){
								moduleInstance = resp;
							} else {
								moduleInstance = res.instance();
							}
							moduleInstance.addTo(self.$context);
						}
					});
				});
			});
		}
	};
});
_define_({
	name : "spamjs.controller",
	modules : [ "jqrouter", "_","jsutils.file"]
}).as(function(CONTROLLER, ROUTER, _, FILEUTILS) {

	
	var handledContext = function(ctrl,self,result){
		return 	jQuery.when(result).done(function(resp){
			if(is.String(resp)){
				if(self.htmlroot!==undefined){
					FILEUTILS.getHTML(self.path(self.htmlroot)+resp).done(function(respHTML){
						ctrl.$context.html(respHTML);
					});
				} else {
					var viewModule = module(resp);
					if(viewModule){
						viewModule.id=self.id;
						viewModule.instance({ params : self.router.getParams()}).addTo(ctrl.$context);
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
				moduleInstance.addTo(ctrl.$context);
			}
		});
	};
	
	return {
		htmlroot : undefined,
		routerMap : {
		},
		_instance_ : function(options) {
			if(options){
				this.$context = options.$context;
				this.id = options.id;
				this.router = options.router;
			}
			this._dff_ = jQuery.Deferred();
			//this.bindController(this);
		},
		start : function($context) {
			var self = this;
			this.bindController(this,$context || this.$context);
			return this;
		},
		bindController : function(self,$context){
			var ctrl = this;
			ctrl.$context = $context || ctrl.$context;
			self.router = self.router || ROUTER.instance();
			_.each(this.routerMap, function(key, url) {
				self.router.on(url, function(param){
					var result = key;
					if(is.Function(self[key])){
						result = self[key].apply(self,arguments);
					}
					if(ctrl.$context){
						handledContext(ctrl,self,result);
					}
					jQuery.when(result).done(function(respResult){
						ctrl._dff_.notify(respResult);
					});
				});
			});
		},
		bind : function(fun){
			if(is.Function(fun)){
				 return this._dff_.promise().progress(fun);
			} else {
				this.bindController.apply(this,arguments);
			}
			return this;
		},
		off: function(){
			this.router.off();
		}
	};
});
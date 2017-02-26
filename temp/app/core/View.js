App["View"] = {
	"construct": function(parameters) {
		this.setTemplate(App.Constant.DEFAULT_TEMPLATE);
		// $(".template").html("");
	},
	"setTemplate": function(template) {
		this["TEMPLATE"] = template;
		return this;
	},
	setTitle: function(title) {
		document.title = title;
	},
	updateProgress: function() {
		var l = this.loaded, t = this.loadTotal;
		$(".progress .determinate").css("width", ((l/t)*100)+"%");
	},
	"render": function() {
		$(".progress").css({"opacity": "1"})
		var template = this.TEMPLATE;
		if(template == false) {
			this.loadPage(false);
		} else {
			var xhttp = new XMLHttpRequest();
			xhttp.addEventListener("load", function() {
				var html = this.responseText;
				if (this.readyState == 4 && this.status == 200) {
					App.View.loadPage(html);
				} else {
					App.location("error", "template-not-found", [template, App.Utility.getControllerCode(App.CONTROLLER), App.ACTION])
				}
			}, false);
			xhttp.addEventListener("error", function() {
				App.location("error", "template-not-found", [template, App.Utility.getControllerCode(App.CONTROLLER), App.ACTION])
			});
			xhttp.addEventListener("progress", function(e) {
			if(e.lengthComputable) {
				$(".progress .determinate").css("width", ((e.loaded/e.total)*100)+"%");
			}
			});
			xhttp.open("GET", "app/views/"+template+".html", true);
			xhttp.send();
		}
	},
	loadPage: function(html) {
		var xhttp = new XMLHttpRequest();
		xhttp.addEventListener("load", function() {
			var html2 = this.responseText;
			if (this.readyState == 4 && this.status == 200) {
				if(html == false) {
					$(".template").html(html2);
				} else {
					$(".template").html(html);
					$("<div></div>").html(html2).children().each(function() {
						$(".template").html($(".template").html().replace(new RegExp("{{"+$(this).attr("id")+"}}", "g"), $(this).html()));
					});
				}
				$(".template").attr("controller", App.Utility.getControllerCode(App.CONTROLLER))
							  .attr("action", App.ACTION);
				App.refresh();
			} else {
				App.location("error", "page-not-found", [App.Utility.getControllerCode(App.CONTROLLER), App.ACTION]);
			}
		}, false);
		xhttp.addEventListener("error", function() {
			App.location("error", "page-not-found", [App.Utility.getControllerCode(App.CONTROLLER), App.ACTION])
		});
		xhttp.addEventListener("progress", function(e) {
			if(e.lengthComputable) {
				$(".progress .determinate").css("width", ((e.loaded/e.total)*100)+"%");
				if((e.loaded/e.total) == 1) {
					setTimeout(function() {
						$(".progress").animate({"opacity": "0"})
					}, 1000);
				}
			}
		});
		xhttp.open("GET", "app/views/"+App.Utility.getControllerCode(App.CONTROLLER)+"/"+App.ACTION+".html", true);
		xhttp.send();
		// $.ajax({
		// 	"cache": true,
		// 	"url": "app/views/"+App.Utility.getControllerCode(App.CONTROLLER)+"/"+App.ACTION+".html",
		// 	"success": function(html2) {
		// 		if(html == false) {
		// 			$(".template").html(html2);
		// 		} else {
		// 			$(".template").html(html);
		// 			$("<div></div>").html(html2).children().each(function() {
		// 				$(".template").html($(".template").html().replace(new RegExp("{{"+$(this).attr("id")+"}}", "g"), $(this).html()));
		// 			});
		// 		}
		// 		$(".template").attr("controller", App.Utility.getControllerCode(App.CONTROLLER))
		// 					  .attr("action", App.ACTION);
		// 		App.refresh();
		// 	},
		// 	"error": function(e) {
		// 		App.location("error", "page-not-found", [App.Utility.getControllerCode(App.CONTROLLER), App.ACTION])
		// 	}
		// })
	}
}
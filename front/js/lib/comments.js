(function(w){
	var d = w.document;

	function Ajax() {
		var that = this;
		function _parseJSON(content) {
			try {
				return w.JSON.parse(content);
			} catch(e) {
				return null
			}
		}

		this._http = new XMLHttpRequest();
		this._request = function(method, url, data, callback, error, headers) {
			this._http.open(method, url)
			if (headers) for (i in headers) this._http.setRequestHeader(i, headers[i]);
			this._http.onreadystatechange = function () {
				if (that._http.readyState == 4) {
					if (that._http.status == 200) {
						callback(_parseJSON(that._http.responseText));
						return true;
					}
					if (that._http.status > 400 && (typeof error == 'function')) {
						error(_parseJSON(that._http.responseText));
						return false;
					}
				}
			};
			this._http.send(data);
		};
		this.get = function(url, callback, error) {
			this._request("GET", url, null, callback, error);
		};
		this.post = function(url, data, callback, error) {
			var urldata = [];
			for (i in data) urldata.push(i + "=" + w.encodeURIComponent(data[i])); 
			this._request("POST", url, urldata.join("&"), callback, error, {
				'Content-type': 'application/x-www-form-urlencoded'
			});
		};
	}

	var toolBox = {
		bind: function(event, el, callback) {
			el.addEventListener(event, function(evnt) {
				callback(el, evnt);
			});
		},
		urlReplace: function(txt) {
			var reg = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i
			if (reg.test(txt))
				return txt.replace(reg, "<a href=\"$1\">$1</a> ");
			return txt;
		},
		noop: function(){},
		parseDate: function(strdate, format) {
		    var expr = /(dd|mm|YYYY|YY|HH|ii|ss)/g,
		        pieces = format.match(expr),
		        myDate = {};
		    if (pieces !== null)
		        while (pieces.length > 0) {
		            curr = pieces.pop();
		            myDate[curr] = (parseInt(strdate.substring(format.indexOf(curr), (format.indexOf(curr) + curr.length)),10)||null);
		        }
		    var returnDate = new Date;
		    returnDate.setFullYear (
		        (myDate.YY||myDate.YYYY||0),
		        ((myDate.mm||1)-1),
		        (myDate.dd||0)
		    );
		    returnDate.setHours(myDate.HH||0);
		    returnDate.setMinutes(myDate.ii||0);
		    returnDate.setSeconds(myDate.ss||0);
		    return returnDate;
		},
		formatDate: function(date, format) {
		    var expr = /(DD|dd|MM|mm|YYYY|YY|HH|ii|ss)/g,
		        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		        pieces = format.match(expr),
		        curr = null,
		        map = function(obj, type) {
		            switch (type) {
		                case 'DD':
		                    return days[obj.getDay()];
		                case 'dd':
		                    var d = obj.getDate();
		                    return (d < 10) ? "0" + d : d;
		                case 'MM':
		                    return months[obj.getMonth()];
		                case 'mm':
		                    var m = (obj.getMonth() + 1);
		                    return (m < 10) ? "0" + m : m;
		                case 'YYYY':
		                case 'YY':
		                    return obj.getFullYear();
		                case 'HH':
		                    var h = obj.getHours();
		                    return (h < 10) ? "0"+h : h;
		                case 'ii':
		                    var i = obj.getMinutes();
		                    return (i < 10) ? "0"+i : i;
		                case 'ss':
		                    var s = obj.getSeconds();
		                    return (s < 10) ? "0"+s : s;
		            }
		            return null;
		        },
		        myDate = format;
		    if (pieces !== null)
		        while (pieces.length > 0) {
		            curr = pieces.pop();
		            myDate = myDate.replace(curr, map(date, curr));
		        }
		    return myDate;
		}
	};

	var helper = {
		createNode: function(type, attrs) {
			el = d.createElement(type);
			for (i in attrs) el.setAttribute(i, attrs[i]);
			return el;
		},
		injectNode : function(type, target, params) {
			$target = d.querySelector(target);
			if (!$target) return false;
			$target.appendChild(this.createNode(type, target, params));
			return el;
		},
		insertNode: function(type, rawHTML, target, params){
			$target = (typeof target == 'string') ? d.querySelector(target) : target;
			if (!$target || !rawHTML) return false;
			var $node = this.createNode(type, params);
			$node.innerHTML = rawHTML;
			$target.appendChild($node);
			return $node;
		},
		parseTemplate: function(tpl, data) {
			var tpl = d.querySelector(tpl).innerHTML;
			for (v in data) {
				var regVar = new RegExp('#\\{' + v + '\\}', 'g');
				tpl = tpl.replace(regVar, (data[v] || ""));
			}
			return tpl;
		}
	};

	var controller = {};

	function DomHandler(elem) {
		var actions = elem.querySelectorAll('[data-comment-action]');
		for(var i=0; i<actions.length; i++) {
			var el = actions[i],
			action = el.attributes.getNamedItem('data-comment-action').value;
			if (typeof w.comments.controller[action] == 'function')
				w.comments.controller[action](el);
		};
	}

	function querySelector (selector, target) {
		if (target && typeof target.querySelector == 'function') return target.querySelector(selector);
		return d.querySelector(selector);
	}

	function querySelectorAll (selector, target) {
		if (target) return target.querySelectorAll(selector);
		return d.querySelectorAll(selector);
	}

	w.comments = {
		ajax: new Ajax,
		dom: DomHandler,
		viewHelper: helper,
		tools: toolBox,
		controller: controller,
		$: querySelector,
		$$: querySelectorAll
	};

	function init() {
		DomHandler(d);
	}

	d.addEventListener('DOMContentLoaded', init, false);
})(window);
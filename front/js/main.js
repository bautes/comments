(function(w, $c){
	var d = w.document,
	c = $c.controller;

	function walkComments (arrayData, id, callback) {
		var filtered = [];
		filtered.push.apply(filtered, arrayData.filter(function(item) {
			return (item.parent_id == id);
		}));

		filtered.forEach(function(item) {
			callback(item, item.parent_id);
			walkComments(arrayData, item.id, callback);
		});
	}

	function insertComments(arrayData, id) {
		walkComments(arrayData, (id || null), function(item, parent_id) {
			var tgt = parent_id ? $c.$('.listComments .listItem[comment-id=item-' + parent_id + '] .item-responses') : $c.$('.listComments');
			insertComment(item, tgt);
		});
	}

	function insertComment (data, target) {
		var IN_DATE_FORMAT = 'YYYY-mm-dd HH:ii:ss',
		OUT_DATE_FORMAT = 'MM, dd YY HH:ii:ss';

		var date = $c.tools.parseDate(data.timestamp, IN_DATE_FORMAT);
		var data = {
			'id': data.id,
			'parent_id': data.parent_id,
			'author': data.email,
			'date' : $c.tools.formatDate(date, OUT_DATE_FORMAT),
			'comment': $c.tools.urlReplace(data.message)	
		};
		var attrData = {
			'comment-id' : "item-" + data.id,
			'class': 'listItem'
		};
		var $tpl = w.comments.viewHelper.parseTemplate('#commentItemTpl', data);
		var el = w.comments.viewHelper.insertNode('li', $tpl, target, attrData);
		var linkNew = $c.$('.item-link-answer', el);
		var frmLoc = $c.$('.item-frm-answer', el);
		$c.tools.bind('click', linkNew, function(el, event) {
			insertForm(frmLoc, {id: data.id});
		});

	}

	function insertForm(where, data) {
		var $tpl = w.comments.viewHelper.parseTemplate('#formItemTpl', data),
		newForm = w.comments.viewHelper.insertNode('div', $tpl, where, {}),
		btnSend = $c.$('#send', where),
		frmAction = $c.$('form[data-action]', where);

		function onSuccess(data) {
			insertComments([data], data.parent_id);
			newForm.parentNode.removeChild(newForm);
		}

		$c.tools.bind('click', btnSend, function(where, event) {
			var action = frmAction.attributes.getNamedItem('data-action').value;
			var postData = {
				email : frmAction.email.value,
				comment: frmAction.comment.value,
				parent_id: (frmAction.parent_id.value || null)
			};
			w.comments.ajax.post(action, postData, onSuccess, $c.tools.noop);
		});
		return false;
	}


	c.newComment = function(el) {
		insertForm(el, {id: null});
	};

	c.showComments = function(elem) {
		function onSuccess(data) {
			insertComments(data);
		}
		var action = elem.attributes.getNamedItem('data-action').value;
		w.comments.ajax.get(action, onSuccess, $c.tools.noop);
	};

})(window, window.comments);
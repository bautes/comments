<?php
require_once('application_controller.php');
require_once(BASE_PATH . '/back/model/comments_model.php');

class Comments_controller  extends Application_controller {

	private $_model = null;
	function __construct() {
		$this->_model = new CommentsModel;
	}

	public function newAction($self, $get, $post) {
		$this->enableJSON();
		$return = $this->_model->addComment($post['email'], $post['comment'], $post['parent_id']);
		echo json_encode($return);
	}

	public function showAction($self, $get) {
		$this->enableJSON();
		$return = $this->_model->getComments();
		echo json_encode($return);
	}

}
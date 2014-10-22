<?php
require_once("baseMysql.php");

class CommentsModel extends baseMysql {
	
	function __construct() {
		parent::__construct();
	}

	public function getComments($since = null) {
		$where = $since ? "WHERE timestamp > $since" : "";
		$result = $this->query(
			array('id', 'parent_id', 'email', 'message', 'timestamp'),
			"comments",
			$where,
			"ORDER BY timestamp DESC"
		);
		$results = array();
		while($row = $result->fetch_assoc())
			$results[] = $row;
		$result->free();
		return $results;
	}

	public function getComment($id) {
		if (!$id) return null;
		$where = "WHERE id = $id";
		$result = $this->query(
			array('id', 'parent_id', 'email', 'message', 'timestamp'),
			"comments",
			$where
		);
		return $result->fetch_assoc();
	}

	public function addComment($email, $message, $parent_id = null) {
		$values = array();
		if ($parent_id) $values['parent_id'] = $parent_id;
		$values['email'] = strip_tags($email);
		$values['message'] = strip_tags($message);
		$newId = $this->insert("comments", $values);
		return $this->getComment($newId);
	}

}
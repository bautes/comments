<?php
class baseMysql {

	private $_mysqli = null; 

	function __construct() {
		$this->_mysqli = new mysqli("localhost", "root", "", "comments");
		if ($this->_mysqli->connect_errno) {
		    echo "Fallo al contenctar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
		}
	}

	public function query($fields, $table, $where="", $order="") {
		$qry = "SELECT " . implode($fields, ",") ." FROM $table $where $order";

		return $this->_mysqli->query($qry);
	}

	public function insert($table, $values) {
		$qry = "INSERT INTO $table (" . implode(array_keys($values), ",") . ") VALUES ('" . implode(array_values($values), "','") . "')";
		if ($this->_mysqli->query($qry))
			return $this->_mysqli->insert_id;
		return 0;
 	}

}

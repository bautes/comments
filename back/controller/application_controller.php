<?php
class Application_controller {
	private $alternative_view = null;
	private $has_view = true;
	private $json_response = false;

	public function hasView() {
		return $this->has_view;
	}
	public function disableView() {
		$this->has_view = false;
	}
	public function enableView() {
		$this->has_view = true;
	}

	public function isJSON() {
		return $this->json_response;
	}

	public function disableJSON() {
		$this->enableView();
		$this->json_response = false;
	}

	public function enableJSON() {
		$this->disableView();
		$this->json_response = true;
	}

	public function setView($view) {
		$this->alternative_view = $view;
	}

	public function getView() {
		return $this->alternative_view;
	}

	public function __call($method, $args) {
	    if (method_exists($this, $method)) {
	      array_unshift($args, $this);
	      return call_user_func_array(array($this, $method), $args);
	    }
	    throw new Exception("Error Processing Request - Undefined method " . $method . " in " . $this, 1);
    }
}
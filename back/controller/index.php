<?php
require_once('application_controller.php');

class Index_controller extends Application_controller {
	
	public function indexAction() {
		$this->setView("index.phtml");
	}
}

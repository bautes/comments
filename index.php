<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('BASE_AJAX_REQUESTS', '/comments/index.php');
define('BASE_FRONT', '/comments/front');
define('BASE_PATH', dirname(__FILE__));


$url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$parts = parse_url($url);

function urlQuery($parts) {
	$urlQuery = explode('/', $parts);
	switch(count($urlQuery)) {
		case 0 || !strlen(implode($urlQuery, "")):
			return array('', 'index', 'index');
		case 1:
			array_push($urlQuery, "index");
		case 2:
			return array_push($urlQuery, "index");
		default:
			return $urlQuery;
	}
};

list(, $controller, $method) = urlQuery($parts['query']);

require_once(dirname(__FILE__) . '/back/controller/' . $controller . '.php');

$controllerName = ucwords((strlen($controller) ? $controller : 'index')) . "_controller";

$inst = new $controllerName;

if ($inst->isJSON()) {
  header('Content-Type: application/json; charset=utf-8');
}

$inst->__call($method . "Action", array($_GET, $_POST));

$alt_view = $inst->getView();
$view = $controller . "/" . (($alt_view !== null) ? $alt_view : $method . ".phtml");
if ($inst->hasView()) {
	ob_start();
	include(dirname(__FILE__) . '/back/view/' . $view);
	ob_flush();
}
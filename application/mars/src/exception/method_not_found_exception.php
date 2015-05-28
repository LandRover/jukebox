<?php
namespace mars\exception
{
	use \Exception;

	/**
	 * This exception used to identify when the invoked method is not found on the controller.
	 */
	class MethodNotFoundException extends Exception {}
	
}
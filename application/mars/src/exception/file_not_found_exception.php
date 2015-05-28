<?php 
namespace mars\exception
{
	use \Exception;
	
	/**
	 * This Exception is being thrown when the application accessing path or dir that are not found on the desired location.
	 */
	class FileNotFoundException extends Exception {}
}
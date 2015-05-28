<?php
namespace jukebox\config
{
	use \mars\MARS;
	use \mars\utils\Request;
	use \mars\utils\Config;
	
	class Base extends Config
	{
		/**
		 * This function will load all default configuration and specific environment too. 
		 * @param $env
		 */
		public function init()
		{
			parent::init();
			
			/* saving all default configuration tree */
			$this->write('debug', true);
			
			$this->write('thumbnail', array(
				'cache' => '../application/tmp/cache/timthumb/'
			));
			
			$this->write('mp3', array(
				'path' => '../mp3/'
			));
            
			$this->write('resources', array(
				'images' => '../application/'.MARS::$APP_NAME.'/resources/images/',
			));
            
			
			/**
			 * Server release version, internal use.
			*/
			$this->write('version', '0.1');
			
			$this->write('mysql', array(
				'host' => 'localhost',
				'port' => 3306,
				'dbname' => 'og_musix',
				'user' => 'og_musix',
				'pass' => 'AN AMAZING PASSWORD'
			));
			
			
			$this->write('session', array(
				'ignoredPaths' => array(
					'^\/favicon.ico',
					'^\/resource',
					'^\/stream\/waveform',
					'^\/stream\/thumbnail'
				),
				'encryptionKey' => md5('ALSO AMAZING KEY'),
				'httpOnly' => true,
				'useOnlyCookies' => true,
				'hash' => 'sha512',
				'hashBitsPerCharacter' => 5
			));
			
			
			$this->write('slim', array(
				'mode' => 'development', //development, production
				
				'http.version' => '1.1',
				
				//log
				'log.level' => 8,
				'log.enabled' => true,
				
				//cookies
				'cookies.lifetime' => '15 days',
				'cookies.encrypt' => false,
				'cookies.path' => '/',
				'cookies.name' => 'jukebox',
				'cookies.httponly' => false,
				'cookies.secure' => false,
				'cookies.secret_key' => md5('COOKIE KEY HERE'),
				'cookies.cipher' => MCRYPT_RIJNDAEL_256,
				'cookies.cipher_mode' => MCRYPT_MODE_CBC
				
			));
			
			$this->write('logWriterSettings', array(
				'path' => '../application/logs',
				'name_format' => 'Y-m-d',
				'extension' => 'log',
				'message_format' => '%label% - %date% - %message%'
			));
			
			$this->write('waveform', array(
				'tmp' => '../application/tmp/waveform/tmp/',
				'cache' => '../application/tmp/waveform/cache/',
				'width' => 2340,
				'height' => 280,
				'isFullView' => false,
				'background' => null,
				'foregroundActive' => '#4f4848',
				'foregroundProgress' => '#ae1818'
			));
			
			$this->write('smarty', array(
				'templates' => '../application/'.MARS::$APP_NAME.'/src/view/',
				'compile' => '../application/tmp/smarty/compile/',
				'cache' => '../application/tmp/smarty/cache/',
				'debugging' => true,
				'compile_check' => true
			));
			
		}
	}
}
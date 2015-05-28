<?php
namespace mars\controller
{
	use \R;
	use \Exception;
	use \mars\Object;
	use \mars\plugins\mysql\Mysql;
	use \mars\controller\AuthenticationController;
	
	/**
	 * Session controller
     * 
     * Handles all the session, login and user data that needs to be stored in the session.
     * 
     * @todo clean up the module. should include only the session handling rather than request data like urls, ips etc.
	 */
	class SessionController extends Object
	{
		static protected $instance; //singleton
		private $config = null;
		private $sessionModel = null;
		
		
		/**
		 * The current session controller is a singleton, obviously
         * 
		 * @return \mars\controller\SessionController
		 */
		static public function create()
		{
			if (is_null(self::$instance))
			{
				self::$instance = parent::create();
			}
			
			return self::$instance;
		}
		
		
		/**
		 * Get key from the session
         * 
         * @todo move to a session util.
         * @param string $key
         * @return bool - null if empty or not found.
		 */
		public function get($key)
		{
			return (isset($_SESSION[$key])) ? $_SESSION[$key] : null;
		}
		
		
		/**
		 * Set key on the session
         * 
         * @todo move to a session util.
         * @param string $key
         * @param mixed $value
		 */
		public function set($key, $value)
		{
			$_SESSION[$key] = $key;
			
			return $_SESSION[$key];
		}
		
		
		/**
		 * Init the object. Sets all the StdCallbacks on the specific actions of the session.
         * Like read, write destroy etc.
         * 
         * ONLY on valid paths.
		 */
		public function start()
		{
			if (true !== $this->isValidLocation())
				return false;
			
			// set our custom session functions.
			session_set_save_handler(
				array($this, 'open'),
				array($this, 'close'),
				array($this, 'read'),
				array($this, 'write'),
				array($this, 'destroy'),
				array($this, 'gc')
			);
			
			// This line prevents unexpected effects when using objects as save handlers.
			register_shutdown_function('session_write_close');
			
			$this->sessionStart('_jukebox', false);
		}
		
		
		/**
		 * action to be called when a session is opened
		 */
		public function open()
		{
			$sql = Mysql::create();
			
			return true;
		}
		
		
		/**
		 * action to be called when a session is closed
         * 
         * Sets the TTL on the garbage collection, when to run it.
		 */
		public function close()
		{
			$this->gc(ini_get('session.gc_maxlifetime'));
			
			return true;
		}
		
		
		/**
		 * Reads session by ID
         * 
         * @param int $sessionID
         * @return object sessionModel
		 */
		public function read($sessionID)
		{
			$session = $this->getSessionByID($sessionID);
			
			if (is_null($session))
				return '';
			
			return $session->session_data;
		}
		
		
		/**
		 * Write and store the session model
         * 
         * @param int $sessionID
         * @param mixed $data
         * @return bool
		 */
		public function write($sessionID, $data)
		{
			$session = $this->getSessionByID($sessionID);
			$authenticated = AuthenticationController::create();
			$user = $authenticated->getUserModel();
			
			//create new session.
			if (is_null($session))
			{
				$session = R::dispense('session');
				$session->useragent = $this->getUserAgent();
				$session->ip = $this->getIP();
				$session->session_id = $this->getSessionID();
			}
			
			$session->user_id = $user->id;
			$session->username = $user->username;
			$session->location = $this->getLocation();
			$session->session_data = $data;
			
			R::store($session);
			
			return true;
		}
		
		
		/**
		 * destory a session by ID
         * 
         * @param int $sessionID
         * @return bool
		 */
		public function destroy($sessionID)
		{
			$session = $this->getSessionByID();
			R::trash($session);
			
			$this->sessionModel = null;
			
			return true;
		}
		
		
		/**
		 * Garbage collection method, how to clean.
         * Called when a sessions clean up is required by the session, time is set by the gc.gc_maxlifetime set on open().
         * Must remain public is it is called via StdCallback
         * 
         * @param int $maxTTL - Maximum allowed time for the session to live.
         * @return bool
		 */
		public function gc($maxTTL)
		{
			$deleteFromTime = time() - $maxTTL;
			
			$expiredSessions = R::findAll('session', 'date_changed < :date_changed', array(':date_changed' => $deleteFromTime));
			
			R::trashAll($expiredSessions);
			
			return true;
		}
		
		
		/**
		 * Start session is responsible on opening the actual session record also creates the cookie.
         * 
         * @param string $sessionName
         * @param bool $secure
		 */
		private function sessionStart($sessionName, $secure)
		{
			$config = $this->getConfig();
			
			// Hash algorithm to use for the sessionid. (use hash_algos() to get a list of available hashes.)
			$sessionHash = $config['sessionHash'];
			
			// Check if hash is available
			if (in_array($sessionHash, hash_algos())) {
				// Set the has function.
				ini_set('session.hash_function', $sessionHash);
			}
			
			// How many bits per character of the hash.
			// The possible values are '4' (0-9, a-f), '5' (0-9, a-v), and '6' (0-9, a-z, A-Z, "-", ",").
			ini_set('session.hash_bits_per_character', $config['hashBitsPerCharacter']);
			
			// Force the session to only use cookies, not URL variables.
			ini_set('session.use_only_cookies', $config['useOnlyCookies']);
			
			// Get session cookie parameters 
			$cookieParams = session_get_cookie_params(); 
			
			// Set the parameters
			session_set_cookie_params($cookieParams['lifetime'], $cookieParams['path'], $cookieParams['domain'], $secure, $config['httpOnly']); 
			
			// Change the session name 
			session_name($sessionName);
			
			// Now we cat start the session
			session_start();
			
			// This line regenerates the session and delete the old one. 
			// It also generates a new encryption key in the database. 
			//session_regenerate_id(true);
		}
		
		
		/**
		 * Get the session id
         * 
         * @return string
		 */
		public function getSessionID()
		{
			return session_id();
		}
		
		
		/**
		 * Externally set config object for the session to use. Make it much easier to unit test and mock.
         * @param array $config
		 */
		public function setConfig($config)
		{
			$this->config = $config;
			
			return $this;
		}
		
		
		/**
		 * Outputs the array set for the current config list.
         * 
         * @return array
		 */
		public function getConfig()
		{
			return $this->config;
		}
		
		
		/**
		 * Outputs the current location uri of the request.
         * 
         * @todo move to a request util!
         * @return string
		 */
		private function getLocation()
		{
			return isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : 'CLI';
		}
		
		
		/**
		 * Outputs the ip of the initiator of the request.
         * 
         * @todo move to a request util!
         * @return string
		 */
		private function getIP()
		{
			return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'CLI';
		}
		
		
		/**
		 * Output useragent of the current request.
         * 
         * @todo move to a request util!
         * @return string
		 */
		private function getUserAgent()
		{
			return isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'CLI';
		}
		
		
		/**
		 * isValidLocation checks if the current location should be stored in session or ignore.
         * The list of the ignoredPaths is passed via setConfig.
         * 
         * @return bool
		 */
		private function isValidLocation()
		{
			$config = $this->getConfig();
			foreach($config['ignoredPaths'] as $invalidPath)
			{
				if (preg_match('/'.$invalidPath.'/', $this->getLocation()))
					return false;
			}
			
			return true;
		}
		
		
		/**
		 * Get specific session model by a sessionID.
         * 
         * @param int $sessionID
         * @return object $sessionModel
		 */
		private function getSessionByID($sessionID)
		{
			if (is_null($this->sessionModel))
				$this->sessionModel = R::findOne('session', 'session_id = :session_id', array(':session_id' => $sessionID));
			
			return $this->sessionModel;
		}
		
		
		/**
		 * Encrypts a string
         * 
         * @todo move it to a enryption/decription util.
         * @param mixed $data
         * @param string $key
         * @return string sha256 encrypted
		 */
		private function encrypt($data, $key)
		{
			$config = $this->getConfig();
            
			$salt = $config['encryptionKey'];
			$key = substr(hash('sha256', $salt.$key.$salt), 0, 32);
            
			$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
			$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
			$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $data, MCRYPT_MODE_ECB, $iv));
			
			return $encrypted;
		}
		
		
		/**
		 * Decrypts a string
         * 
         * @todo move it to a enryption/decription util.
         * @param mixed $data
         * @param string $key
         * @return string
		 */
		private function decrypt($data, $key)
		{
			$config = $this->getConfig();
			$salt = $config['encryptionKey'];
            
			$key = substr(hash('sha256', $salt.$key.$salt), 0, 32);
			$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
			$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
			$decrypted = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($data), MCRYPT_MODE_ECB, $iv);
			
			return $decrypted;
		}
	}
}
<?php
namespace mars\controller
{
	use \R;
	use \Exception;
	use \mars\Object;
	use \mars\plugins\slim\SlimWrapper;
	use \mars\exception\MethodNotFoundException;
	use \mars\plugins\mysql\Mysql;
	
	/**
     * Authentication is responsible for handling the user rights to do actions. Very simple.
     */
	class AuthenticationController extends Object
	{
		static protected $instance; //singleton
		private $authentication = null;
		private $userModel = null;
		
		
		/**
		 * The current request is a singleton, obviously
         * 
		 * @return \mars\controller\AuthenticationController
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
         * Constructor, connects to the DB and loads the current user session (if not loaded before that)
         */
		public function init()
		{
			$sql = Mysql::create();
			$this->loadSessionUser();
		}
		
        
        /**
         * Verifies the user is authenticated with a proper username and password.
         * 
         * @return bool
         */
		public function isAuthenticated()
		{
			return ($this->getUserModel()->acess_level > 0);
		}
		
        
        /**
         * Verifies the user is authenticated and the user is an admin!
         * 
         * @return bool
         */
		public function isAdmin()
		{
			return ($this->getUserModel()->acess_level < 5);
		}
		
		
        /**
         * Sets the loaded from DB userModel
         * 
         * @param UserModel $user
         * @return this AuthenticationController (for chaining)
         */
		public function setUserModel($user)
		{
			$this->userModel = $user;
			
			return $this;
		}
		
		
        /**
         * Returns the UserModel instance
         * 
         * @return UserModel
         */
		public function getUserModel()
		{
			return $this->userModel;
		}
		
		
        /**
         * Executes the login action
         * 
         * @param string $username
         * @param string $password
         * @return UserModel $user
         */
		public function doLogin($username, $password)
		{
			$user = $this->checkLogin($username, $password, true);
			
			if (!is_null($user))
			{
				$this->extendSession($user);
			}
			
			return $user;
		}
		
        
        /**
         * Logges user out from the system, deletes the cookie.
         */
		public function doLogout()
		{
			if (isset($_COOKIE['login']))
			{
				$slim = SlimWrapper::create()->getSlimInstance();
				$slim->deleteCookie('login');
				$slim->setEncryptedCookie('login', null);
			}
		}
		
        
        /**
         * Verifies the login is valid, by an input
         * 
         * @param string $username
         * @param string $password
         * @param bool $isPlain
         * @return UserModel $user
         */
		public function checkLogin($username, $password, $isPlain = true)
		{
			$credentials = array(
				':username' => $username,
				':password' => (true === $isPlain) ? $this->encryptPassword($password) : $password
			);
			
			$user = R::findOne('user', '(username = :username OR email = :username) AND password = :password', $credentials);
			
			return $user;
		}
		
		
        /**
         * Verifies Authentication is enough to access the module
         * 
         * @param string $className (The namespace of the class that in question)
         * @return bool
         */
		public function verifyAuthentication($className)
		{
			return ($className::$MINIMUM_ACCESS_LEVEL <= $this->getUserModel()->access_level);
		}
		
        
        /**
         * Extends the session with extra params.
         * 
         * @param UserModel $user
         * @todo currently coupled only to extend UserModel - should be more generic method.
         * @return this AuthenticationController (for chaining)
         */
		public function extendSession($user)
		{
			$login = array(
				'userID' => $user->id,
				'username' => $user->username,
				'password' => $user->password
			);
			
			$slim = SlimWrapper::create()->getSlimInstance();
			$slim->setEncryptedCookie('login', json_encode($login));
			
			return $this;
		}
		
		
        /**
         * Extends the session with extra params.
         * 
         * @param UserModel $user
         * @todo currently coupled only to extend UserModel - should be more generic method.
         * @return this AuthenticationController (for chaining)
         */
		public function getLoginCookie()
		{
			$slim = SlimWrapper::create()->getSlimInstance();
			
			if (isset($_COOKIE['login']))
			{
				$login = json_decode($_COOKIE['login'], true);
			}
			
			return (isset($login) && is_array($login) ? $login : null);	
		}
		
		
        /**
         * Get user params from the model - excludes private properties such as: password, email and ip.
         * 
         * @todo figure a better way to return without private properties.
         * @return UserModel
         */
		public function getUserModelPublic()
		{
			$userModel = array();
			$privateFields = array(
				'password',
				'email',
				'ip'
			);
			
			foreach ($this->getUserModel() as $field => $value)
			{
				if (!in_array($field, $privateFields))
					$userModel[$field] = $value;
			}
			
			$userModel['sessionID'] = $this->getSessionID();
			
			return (Object) $userModel;
		}
		
		
        /**
         * Get the sessionID
         * 
         * @todo move session data to proper managment location, maybe a util.
         * @return string
         */
		public function getSessionID()
		{
			return session_id();
		}
        
        
        /**
         * Encrypts password to be stored in the database
         * 
         * @param string $password (plain)
         * @return string encrypted password
         */
		private function encryptPassword($password)
		{
			return md5(md5($password) + md5($password));
		}
		
        
        /**
         * Loads session user, and extend the usermodel with the login info.
         * Also responsible on verifing the login details from the cookie.
         */
		private function loadSessionUser()
		{
			$slim = SlimWrapper::create()->getSlimInstance();
			$me = $this;
			
			$slim->hook('slim.before.dispatch', function() use ($slim, $me)
			{
				$user = R::dispense('user');
				
				$login = $me->getLoginCookie();
				
				if (!is_null($login))
				{
					$verifyUser = $me->checkLogin($login['username'], $login['password'], false);
					if (!is_null($verifyUser))
					{
						$user = $verifyUser;
						$me->extendSession($user);
					} else {
						// do logout.
					}
				}
				
				$me->setUserModel($user);
				
				$slim->view()->setData('user', $me->getUserModelPublic());
			});
		}
	}
}
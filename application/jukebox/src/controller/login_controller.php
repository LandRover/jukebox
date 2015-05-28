<?php
namespace jukebox\controller {
    
	use \R;
	use \Exception;
    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\slim\SlimWrapper;
    use \mars\controller\AuthenticationController;


    class LoginController extends Controller
    {
    	public static $MINIMUM_ACCESS_LEVEL = 0; // guest.
    	
        public function init($application)
        {
            parent::init($application);
        }
        
        
        public function start()
        {
            $this->render('login', array('jukebox' => array('a' => '')));
        }
        

        public function doLogin()
        {
        	$stdInput = SlimWrapper::create()->getSlimInstance()->request()->getBody();
        	$postData = json_decode($stdInput, true);
        	
        	$login = $postData['login'];
        	$password = $postData['password'];
        	
        	$validateLogin = AuthenticationController::create()->doLogin($login, $password);
        	
            //verify ONLY POST IS SENT!
            $authResponse = array('description' => 'Login Failed, Try again!', 'status' => (null === $validateLogin) ? false : true);

            header('Content-Type: application/json');
            echo json_encode($authResponse);
        }
        
        
        public function doLogout()
        {
        	$validateLogin = AuthenticationController::create()->doLogout();
			SlimWrapper::create()->getSlimInstance()->response->redirect('/', 302);
        }

    }
}

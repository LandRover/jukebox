<?php
namespace jukebox\model
{
    use \Exception;
    
    use \mars\utils\Event;
    use \mars\model\Model;
    use \mars\plugins\slim\SlimWrapper;
    
    
    class UserModel extends Model
    {
        // default values, schema.
        public function dispense()
        {
            $slim = SlimWrapper::create()->getSlimInstance();
            
            $this->id = $this->id;
            $this->username = 'Guest';
            $this->password = null;
            $this->email = '';
            $this->access_level = 0;
            $this->ip = $slim->request()->getIp();
        }
    }
}

<?php
namespace mars\model
{
	use \Exception;
	use \mars\Object;
    use \RedBean_SimpleModel;

	
	/**
     * Generic model, extends our library of choise for ORM, RedBeam (can be swtiched relativly easy)
	 */
	class Model extends RedBean_SimpleModel
	{
		private static $DATE_FORMAT = 'Y-m-d H:i:s'; // triggered and stored in db as datetime.
		
        /**
         * Defaults - shared for all models create and change dates. 
         */
        public function dispense()
		{
            $this->bean->date_created = date(self::$DATE_FORMAT);
            $this->bean->date_changed = date(self::$DATE_FORMAT);
        }
        
        
        /**
         * On each update, stores the date of the change 
         */
        public function update()
		{
            $this->bean->date_changed = date(self::$DATE_FORMAT);
        }
	}
}
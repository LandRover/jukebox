<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \R;
    
    
    /**
     * 
     */
    class SearchController extends Controller
    {
        private static $LIMIT_ARTISTS = '5';
        private static $LIMIT_ALBUMS = '5';
        private static $LIMIT_SONGS = '5';
        
        
        /**
         * 
         */
        public function init($application)
        {
            parent::init($application);
            $sql = Mysql::create();
            header('Content-Type: application/json');
        }
        
        
        /**
         * Fetch all artists, songs and albums for auto complete functionality.
         * Used for autocomplete, top quick search bar at the navigation panel.
         */
        public function quick($param)
        {
            $keyword = (isset($param[0])) ? '%'. $param[0] .'%' : null;
            
            $artists = (isset($keyword) ? R::findAll('artist', 'name LIKE :name LIMIT '.self::$LIMIT_ARTISTS, array(
                ':name' => $keyword
            )) : null);
            
            $albums = (isset($keyword) ? R::findAll('album', 'name LIKE :name LIMIT '.self::$LIMIT_ALBUMS, array(
                ':name' => $keyword
            )) : null);
            
            $songs = (isset($keyword) ? R::findAll('song', 'name LIKE :name LIMIT '.self::$LIMIT_SONGS, array(
                ':name' => $keyword
            )) : null);
            
            echo json_encode(array(
                'artists' => $this->flattenCollection($artists),
                'albums' => $this->flattenCollection($albums),
                'songs' => $this->flattenCollection($songs)
            ));
        }
        
        
        /**
         * 
         */
        private function flattenCollection($collection)
        {
            $modelsList = array();
            
            foreach($collection as $model)
            {
                $modelParams = $model->export();
                if (isset($modelParams['path'])) $modelParams['path_bits'] = explode('/', $modelParams['path']); 
                $modelsList[] = $modelParams;
            }
            
            return $modelsList;
        }
    }
}
<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \R;

    class ArtistsController extends Controller
    {
        public static $LIMIT = 10;
        
        public function init($application)
        {
            parent::init($application);
            $sql = Mysql::create();
        }

        public function all()
        {
            header('Content-Type: application/json');
            
            echo json_encode($this->artistsAll());
        }
        
        
        private function artistsAll()
        {
            $artists = R::findAll('artist',
                'ORDER BY name LIMIT :limit', array(':limit' => 1500)
            );
            
            return $this->flattenCollection($artists);
        }
        
        
        /**
         * TODO: MOVE TO GLOBAL??
         */
        private function flattenCollection($collection)
        {
            $modelsList = array();
            
            foreach($collection as $model)
            {
                $modelParams = $model->export(); 
                
                if (isset($modelParams['path']))
                {
                    $pathBits = explode('/', $modelParams['path']);
                    switch (sizeof($pathBits)) {
                        case 2:
                            //it's an album
                            $modelParams['artist'] = $pathBits[0];
                            break;
                            
                        case 3:
                            //it's a song
                            list($albumName, ) = preg_split('/\s+(?=\S*$)/', $pathBits[1]);
                            $modelParams['album'] = $pathBits[1];
                            $modelParams['albumName'] = $albumName;
                            break;
                    }
                }

                $modelsList[] = $modelParams;
            }
            
            return $modelsList;
        }
    }
}
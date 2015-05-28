<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \R;

    class IndexController extends Controller
    {
    	public static $LIMIT = 100;
    	
        public function init($application)
        {
            parent::init($application);
			$sql = Mysql::create();
        }


        public function start()
        {
            $this->render('index', array(
				'playlists' => $this->getPlaylistsList()
			));
        }
        
        
        public function api()
        {
            header('Content-Type: application/json');
            
            echo json_encode(array(
				'albums_featured' => $this->albumsFeatured(),
				'albums_new' => $this->albumsNew(),
				'albums_hot' => $this->albumsHot(),
				
				'songs_featured' => $this->songsFeatured(),
				'songs_new' => $this->songsNew(),
				'songs_hot' => $this->songsHot(),
				
				'artists_featured' => $this->artistsFeatured(),
				'artists_new' => $this->artistsNew()
			));
        }
        
        
        private function getPlaylistsList()
		{
        	$albums = R::findAll('playlist',
                'user_id = 1 LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($albums);
        }
        
        
        private function albumsFeatured()
		{
        	$albums = R::findAll('album',
                'is_featured = 1 ORDER BY is_featured ASC LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($albums);
        }
        
        
        private function albumsNew()
		{
        	$albums = R::findAll('album',
                'ORDER BY date_created DESC LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($albums);
        }
        
        
        private function albumsHot()
		{
        	$albums = R::findAll('album',
                'ORDER BY count_views DESC LIMIT :limit', array(':limit' => self::$LIMIT)
			);

			return $this->flattenCollection($albums);
        }
        
        
        private function songsFeatured()
		{
        	$songs = R::findAll('song',
                'is_featured = 1 ORDER BY is_featured ASC LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($songs);
        }
        
        
        private function songsNew()
		{
        	$songs = R::findAll('song',
                'GROUP BY album_id ORDER BY date_created DESC LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($songs);
        }
        
        
        private function songsHot()
		{
        	$songs = R::findAll('song',
                'ORDER BY count_views DESC LIMIT :limit', array(':limit' => self::$LIMIT)
			);

			return $this->flattenCollection($songs);
        }
        
        
        private function artistsFeatured()
		{
        	$artists = R::findAll('artist',
                'is_featured = 1 ORDER BY is_featured ASC LIMIT :limit', array(':limit' => self::$LIMIT)
			);
			
			return $this->flattenCollection($artists);
        }
        
        
        private function artistsNew()
		{
        	$artists = R::findAll('artist',
                'ORDER BY date_created DESC LIMIT :limit', array(':limit' => self::$LIMIT)
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
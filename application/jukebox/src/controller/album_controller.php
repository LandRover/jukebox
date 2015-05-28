<?php
namespace jukebox\controller {
    
	use \R;
	use \Exception;
    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \mars\plugins\slim\SlimWrapper;
    
    
	/**
	 * Album main controller, CRUD for albumns controlling.
     * Able to get albums, return as JSON, etc.
     * 
     * @todo Centrlize returns, must NOT echo anything, should return to an object to generate the output! VERY IMPORTANT.
	 */
    class AlbumController extends Controller
    {
		/**
		 * Constructor method, 
		 */
        public function init($application)
        {
            parent::init($application);
            $sql = Mysql::create();
            
            header('Content-Type: application/json'); // a bit ugly, yes but sets header to json until it moves from here.
        }
        
        
		/**
		 * Fetch all albums by artist.
         * Gets the albums list and the songs list in each album.
         * 
         * @param array $param
         * @return array albums list
		 */
        public function getAlbums($param)
        {
            $albumsList = array();
			$artist = (isset($param[0]) ? R::findOne('artist', ' name = :name', array(':name' => $param[0])) : null);

			// single album fetch with songs..
			if (isset($param[1]))
            {
				$album = (isset($param[1]) ? R::findOne('album', ' name = :name AND path LIKE :path', array(':name' => $param[1], ':path' => '%'.$param[0].'%')) : null);
				$this->assert(!is_null($album), 'Album could not be found. Path: '.$param[0].'/'.$param[1]);
				
				$songsList = array();
				
                $songs = R::findAll('song',
                    'artist_id = :artist_id AND album_id = :album_id ORDER BY track_id', array(
                    ':artist_id' => $artist->id,
                    ':album_id' => $album->id)
				);
                
				foreach($songs as $song)
				{
					$songsList[] = $song->export();
				}
				
                //returns the albums and songs list for each.
				$albumsList[] = array_merge(
					$album->export(),
					array('songs' => $songsList),
					array('artist' => $artist->export())
				);
				
			} else {
				// few albums, no single album specified.
				if (is_null($artist)) {
					$albums = R::findAll('album', '');
				} else {
					$albums = R::findAll('album', 'artist_id = :artist_id', array(':artist_id' => $artist->id));
				}
				
				foreach($albums as $album)
				{
					$album = $album->export();
					
					$albumsList[] = array_merge(
						$album,
						array('artist_title' => $this->pathToName($album['path']))
					);
				}
			}
            
            echo json_encode($albumsList);
        }
       
        
		/**
		 * Update method.
         * At this point only resticted for marking an album as featured. 
		 */
        public function update($param)
        {
        	$id = $param[2];
       		$stdInput = SlimWrapper::create()->getSlimInstance()->request()->getBody();
        	$postData = json_decode($stdInput, true);
        	
        	//get album by id
            $album = R::load('album', $id);
            
			if (is_null($album)) {
            	$updateResponse = array(
					'description' => 'Album was not found, '. $id,
					'status' => false
				);
            } else {
            	$updateResponse = array(
					'description' => 'Done',
					'status' => true
				);
				
				$album->is_featured = $postData['is_featured'];
				R::store($album);
            }

            echo json_encode($updateResponse);
        }
        
        
        /**
         * Extracts the artist name from the path due to convenstion
         * The format is: Artist/Album (Year)
         * 
         * @param string $path
         * @todo move it from here, should be at the string util.
         * @return string artist name, first param 
         */
        private function pathToName($path)
		{
        	list($artist) = explode('/', $path);
        	
        	return $artist;
        }
    }
}
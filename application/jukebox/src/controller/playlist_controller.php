<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \mars\plugins\slim\SlimWrapper;
    use \mars\controller\AuthenticationController;
    use \R;

    class PlaylistController extends Controller
    {
    	public static $LIMIT = 100;
    	private $user = null;
    	
        public function init($application)
        {
            parent::init($application);
			$sql = Mysql::create();
			
			header('Content-Type: application/json');
			
			$this->user = AuthenticationController::create()->getUserModel();
        }

        
        public function getMyPlaylists()
		{
        	$playlists = R::findAll('playlist',
                'user_id = :user_id LIMIT :limit', array(
					':user_id' => $this->user->id,
					':limit' => self::$LIMIT
			));
			
			echo json_encode($this->flattenCollection($playlists));
        }
        
        
        public function getPlaylist($param)
		{
            $id = $param[0];
        	$playlist = R::load('playlist', $id)->export();
			$this->assert($playlist['user_id'] == $this->user->id || '1' === $playlist['is_public'], 'Invalid ownership of the playlist, You can not view a private playlist.');
			
            $playlist['songs_list'] = json_decode($playlist['songs_list']);
            
            $songs = R::findAll('song',
                'id IN('.implode(',', $playlist['songs_list']).')'
            );

			$songsList = $this->flattenCollection($songs);

            $songsListDictionary = array();
            foreach ($songsList as $song)
                $songsListDictionary[$song['id']] = $song;
            
            $songsMergedList = array();
            foreach ($playlist['songs_list'] as $sondID) {
                $songsMergedList[] = $songsListDictionary[$sondID];
            }
            
            $playlist['songs_list'] = $songsMergedList;
			
			echo json_encode($playlist);
        }
        
        
		/**
		 * Fetch all albums by artist.
		 */
        public function update($param)
        {
        	$songIds = '';
        	$id = $param[0];
       		$stdInput = SlimWrapper::create()->getSlimInstance()->request()->getBody();
        	$postData = json_decode($stdInput, true);
        	
        	if (is_array($postData['songs_list'])) {
                $songIds = $postData['songs_list'];
            } else {
                $songIds = array();
                
                if ('' !== $postData['songs_list'])
            	   $songIds = json_decode($postData['songs_list']);
            }
        	
        	$playlist = R::load('playlist', $id);
        	
        	$this->assert($playlist->user_id == $this->user->id, 'Invalid ownership of the playlist, you can not modify a list you do did not create.');
        	
			if (is_null($playlist)) {
            	$updateResponse = array(
					'description' => 'Playlist was not found, '. $id,
					'status' => false
				);
            } else {
                if ($postData['isAppend']) {
					$existingList = array();
		            
		            if ('' !== $playlist->songs_list)
		        	   $existingList = json_decode($playlist->songs_list);
                    
                    $songsMergedList = array_merge($existingList, $songIds);
                    
                    $playlist->songs_list = json_encode($songsMergedList);
                    $playlist->songs_count = sizeof($songsMergedList);
                } else {
                    $playlist->songs_list = json_encode($songIds);
                    $playlist->songs_count = sizeof($songIds);
                }
                
                $updateResponse = array(
                    'description' => 'Done',
                    'status' => true,
                    'songs_list' => $playlist->songs_list,
                    'songs_count' => $playlist->songs_count
                );
                
                R::store($playlist);
            }
            
            echo json_encode($updateResponse);
        }
        
        
        public function add() {
        	$playlist = R::dispense('playlist');
        	
       		$stdInput = SlimWrapper::create()->getSlimInstance()->request()->getBody();
        	$postData = json_decode($stdInput, true);
        	
        	$playlist->name = $postData['name'];
        	$playlist->songs_list = json_encode($postData['songs_list']);
        	$playlist->songs_count = sizeof($postData['songs_list']);
        	$playlist->user_id = $this->user->id;
        	
        	$playlistID = R::store($playlist);
        	
        	echo json_encode(array(
				'status' => true,
				'id' => $playlistID,
				'user_id' => $playlist->user_id,
				'songs_count' => $playlist->songs_count
			));
        }
        
        
        public function delete($param) {
			$id = $param[0];
        	
			$playlist = R::load('playlist', $id);
			$this->assert($playlist->user_id == $this->user->id, 'Invalid ownership of the playlist.');
			
			R::trash($playlist);
			
        	echo json_encode(array(
				'status' => true,
				'id' => $id
			));
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
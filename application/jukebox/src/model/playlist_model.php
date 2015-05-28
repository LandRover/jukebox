<?php
namespace jukebox\model
{
	use \Exception;
	
	use \mars\utils\Event;
    use \mars\model\Model;
	
	
	class PlaylistModel extends Model
	{
		public function getFirstSongID()
		{
			$songs = json_decode($this->songs_list);

			return $songs[0];
		}
	}
}
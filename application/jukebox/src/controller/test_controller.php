<?php
namespace jukebox\controller {
    use \Exception;

    use \mars\utils\Event;
    use \mars\controller\Controller;
    use \mars\plugins\mysql\Mysql;
    use \R;

    class TestController extends Controller
    {
        public function init($application)
        {
            parent::init($application);
        }

        public function start()
        {
            $sql = Mysql::create();

            R::nuke();

            // structure artist and 2 albums
            $artistName = 'Fatz Waller';
            $artist = R::findOne('artist', ' name = :name', array(':name' => $artistName));

            //artist not found - add new.
            if (is_null($artist)) {
                $artist = R::dispense('artist');
                $artist->name = $artistName;
                $artist->albums = 1;
                $artist->votes = 0;

                R::store($artist);
            }

            $albumsFound = array();
            foreach (array(
                'Album No. 2',
                'Album No. 1',
                'Album No. 0') as $albumDir) {
                $album = R::findOne('album', ' name = :name AND artist_id = :artist_id', array(':name' =>
                        $albumDir, ':artist_id' => $artist->id));

                // album not found - ADD.
                if (is_null($album)) {
                    $album = R::dispense('album');
                    $album->name = $albumDir;
                    $album->year = 2014;
                }

                $albumsFound[] = $album;
            }

            //store detected albums to artist.
            $artist->ownAlbums = $albumsFound;
            R::store($artist);


            //handle album songs
            $album = R::findOne('album', ' name = :name AND artist_id = :artist_id', array(':name' =>
                    'Album No. 2', ':artist_id' => $artist->id));
            $songsFound = array();
            foreach (array(
                '01 - LALALALA.mp3',
                '02 - hyyyyyyyyyyyyyyyyyyy.mp3',
                '03 - NANANANA.mp3') as $songFile) {
                $song = R::findOne('song',
                    ' name = :name AND artist_id = :artist_id AND album_id = :album_id', array(
                    ':name' => $albumDir,
                    ':artist_id' => $artist->id,
                    ':album_id' => $album->id));

                if (is_null($song)) {
                    $song = R::dispense('song');
                    $song->name = $songFile;
                    $song->bitrate = 320;
                    $song->times_played = 0;
                    $song->date_add = time();
                    $artist->link($song);

                    $songsFound[] = $song;
                }

                echo json_encode($song);
            }

            $album->ownSongs = $songsFound;

            print_r($album);
            R::store($album);
            R::store($artist);


            //R::dependencies(array('song' => array('album', 'artist')));
            //fetch song by ID
            $album = R::load('album', 1);
            $songs = R::batch('song', R::related($album, 'song'));

            print_r($songs);


            /*
            //SAMPLE !!!
            $user = R::load('user', 1);
            $blog = R::dispense("blog");
            $blog->title = 'Blog title';
            $blog->content = 'Blog content/text, this is in the form of wiki syntax to be cleared at the render stage.';
            $blog->status = 1;
            $blog->created_at = time();
            $blog->updated_at = $blog->created_at;
            $comment = R::dispense("comment");
            $comment->content = 'Test comment associated';
            $comment->created_at = time();
            $comment->updated_at = $comment->created_at;
            $reply = R::dispense('reply');
            $reply->created_at = time();
            $reply->content = 'Linking a reply!';
            $comment->link($blog);
            $comment->link($user);
            $reply->link($comment);
            $reply->link($user);
            $blog->link($user);
            $reply->link($user);
            
            R::store($comment);
            R::store($reply);
            R::store($blog);
            */

            //fetching..

            /*
            $artist = R::load('artist', 5);
            $artist->name = 'Artist Sample';
            $artist->albums = 2;
            $artist->votes = 0;
            
            list($album1, $album2) = R::dispense('album', 2);
            $album1->name = 'Album No. 1';
            $album1->year = 2011;
            
            $album2->name = 'Album No. 2';
            $album2->year = 2012;
            
            $artist->ownAlbums = array($album1, $album2);
            R::store($artist);
            */

        }

    }
}

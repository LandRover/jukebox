# Jukebox v0.1

![](https://raw.githubusercontent.com/LandRover/jukebox/master/application/jukebox/resources/images/_preview-img-v0.1.png)

## What is Jukebox?
Jukebox is an open-source music platform, a Grooveshark(R.I.P) inspired. Built using MARS for backend and backbone(Underscore and jQuery) for frontend.

I built it mainly for myself back in 2013 to be able to access my music library from anywhere and allow my friends and family to enjoy it as well rather than everyone storing their own data. A while go Grooveshark (Liked it a lot) also closed and I decided to open-source the project for few reasons, mainly get more ideas and share with my friends the source code and allow everyone basicly to have their own library.

My goal is to apply techniques used in modern web building, such as AMD modules, dependency management, build process, optimization and monitoring tools as well as performance.

Some of the features included in Jukebox:
 * Play your music
 * Search for music
 * Create personal and public(on-site members) playlists.
 * Advnaced player - Grooveshark inspired UI.
 * Currently runs on PC only - mobile adjustments are required but not far from there.
 * On fly Waveform generation.
 * Modular elements structure for both client and server side.
 * CLI / Web access alike.
 * Horizontal scrolling for across all website, feels modern with large thumbnails.
 * Import music is done via CLI (cd public_html; php index.php import artists;).
 * Configurable path for mp3 dir (must follow strict convenstions).
 * ID3 tag parsing for v2.1, 2.3 and 2.4.
 * Supports MP3 only.
 * WebAudio based audio player with crossfade feature (100% HTML5, not flash required).
 * Due to strick restrictions on the mp3 content dir I'm able to print the albums nicly with a huge cover flow.

### MP3 dir convenstions:
 1. The general structure inside the MP3 Path is: Artist\Album (Year)
 2. Artist must contain inside a photo, of 500x500 under the same name in a jpg format (ex. Artist\Artist.jpg)
 2. Inside the artist dir all albums must contain a 4 digit year (0000)
 3. Each album must contain at least 500x500 under the name cover.jpg (ex. Artist\Album (Year)\cover.jpg)
 4. Other images like back.jpg, cd.jpg, front.jpg also allowed but currently not displayed.
 5. For multi CD albums the first digit before the trackID should be the CDID
 6. Inside an album dir, all mp3 files must be in 4 possible formats:
    * $num(%track%,2) - %title%
    * $num(%track%,2) - %artist% - %title%
    * $num(%discnumber%,1)$num(%track%,2) - %title%
    * $num(%discnumber%,1)$num(%track%,2) - %artist% - %title%
 7. Example:
```
── 1 Giant Leap
│   ├── 1 Giant Leap.jpg
│   └── What About Me (2009)
│       ├── 101 - Come To The Edge (Feat. Lila Downs & Huun Huur Tu).mp3
│       ├── 102 - Each Step Moves Us On (Feat. Zap Mama & Speech).mp3
│       ├── 103 - How Can I Be A Better Friend To You (Feat. Jhelisa Anderson & Maxi Jazz).mp3
│       ├── 201 - Under A Stormy Sky  I've Been Away.mp3
│       ├── 202 - What I Need Is Something Different (Feat. Speech & Boots Riley).mp3
│       ├── 203 - Mothers, Don't Cry (Feat. Miss Honda, Ramata Diakite & Miles Solay).mp3
│       └── cover.jpg
```

### Todos
  * Form MARS away from here
  * Intergrate Grunt.
  * Integrate Less
  * Better documentation is required.
  * Commit unit testing suite
  * Figure out better UI to navigate, I'm not so sure the about the horizontal scroll, makes some mess in mobile etc.
  * Player has a major js bug which makes it freeze for some reason after ~10 songs.
  * Remove drag and drop to the player - useless and casuses more bugs (Done originally with jQuery UI).
  * Bump all versions to latests (Slim, backbone, loadash, RedBeam, bootstrap)
  * Integrate all the 3rd parties with node_modules and bower


## What is MARS?
MARS is a lightweight PHP framework that bundling the following open-source libraries, such as: Slim, RedBeam, Smarty. By default MARS uses MySQL as default DB engine but can be easlie plugged with other data sources.

The database abstraction is done using RedBeam ORM, which offers rapid development features such as FluidMode which can I use while developing and creates all structure on the fly without the need to alter tables.

MARS follows some conventions to load modules and urls. (Will be documented when MARS is moved to it's own repository)

To learn more about these powerful libraries, check this out:
* **Routing**: Slim ([codeguy/Slim](https://github.com/codeguy/Slim))
* **Persistence/ORM**: RedBean ([gabordemooij/redbean](https://github.com/gabordemooij/redbean))
* **Templating**: Smarty ([smarty-php/smarty](https://github.com/smarty-php/smarty))
* **Frontend/Client Side**: BackBone ([jashkenas/backbone](https://github.com/jashkenas/backbone))
* **UI**: Bootstrap ([twitter/bootstrap](https://github.com/twitter/bootstrap))
 
MARS is mainly a wrapper over Slim and all the other components to make it easier to swtich and contain shared utils that used under the MARS framework.

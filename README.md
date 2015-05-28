# Jukebox v0.1

## What is Jukebox?
Jukebox is an open-source music platform, a Grooveshark(R.I.P) inspired. Built using MARS for backend and backbone(Underscore and jQuery) for frontend.

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

### MP3 dir convenstions:
 1. The general structure inside the MP3 Path is: Artist\Album (Year)
 2. Artist must contain inside a photo, of 500x500 under the same name in a jpg format (ex. Artist\Artist.jpg)
 2. Inside the artist dir all albums must contain a 4 digit year (0000)
 3. Each album must contain at least 500x500 under the name cover.jpg (ex. Artist\Album (Year)\cover.jpg)
 4. Other images like back.jpg, cd.jpg, front.jpg also allowed but currently not displayed.
 5. Inside an album dir, all mp3 files must be in 4 possible formats:
    * $num(%track%,2) - %title%
    * $num(%track%,2) - %artist% - %title%
    * $num(%discnumber%,1)$num(%track%,2) - %title%
    * $num(%discnumber%,1)$num(%track%,2) - %artist% - %title%
 6. Example:
   ```php
   ── 1 Giant Leap
   │   ├── 1 Giant Leap.jpg
      │   └── What About Me (2009)
   │       ├── 101 - Come To The Edge (Feat. Lila Downs & Huun Huur Tu).mp3
   │       ├── 102 - Each Step Moves Us On (Feat. Zap Mama & Speech).mp3
   │       ├── 103 - How Can I Be A Better Friend To You (Feat. Jhelisa Anderson & Maxi Jazz).mp3
   │       ├── 201 - Under A Stormy Sky  I've Been Away (Feat. Haale, Michael Franti, Maxi Jazz, Eddi Reader & Dan
   │       ├── 202 - What I Need Is Something Different (Feat. Speech & Boots Riley).mp3
   │       ├── 203 - Mothers, Don't Cry (Feat. Miss Honda, Ramata Diakite & Miles Solay).mp3
   │       └── cover.jpg
   ```



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
 
MARS is mainly a wrapper over Slim to make it easier to swtich and contain shared utils that used under the MARS framework.

<?php
class Waveform {
    const BYTE = 8;
    const OFFSET = 44;
    const LAME_BIN = '/usr/local/bin/lame';
    
    private $file = null;
    private $accuracy = 100;
    private $spectrumData = array();
    private $colorBackground = null;
    private $colorForeground = null;
    private $width = 2340;
    private $height = 280;
    private $tmpDir = null;
    private $tmpFilename = null;
    
    
    public function __construct($tmpDir) {
        ini_set('max_execution_time', '30000');
        
        /*
        $wave = new Waveform('/home/meru/domains/m.full-on.com/public_html/_wave/_tmp/');
        $wave->setFile('/home/meru/domains/m.full-on.com/public_html/_wave/song_sample5.mp3')
             ->png(2340, 280, false, '#aa0000');
        */
        $this->setTmpDir($tmpDir);
    }
    
    
    public function setFile($file) {
        $this->file = $file;
        
        if ('wav' !== $this->getExt($file))
            $this->file = $this->getConvertedWav();
        
        return $this;
    }
    
    
    public function getFile() {
        return $this->file;
    }
    
    
    public function setColorForeground($colorForeground) {
        $this->colorForeground = $this->getRGBArray($colorForeground);
        
        return $this;
    }
    
    
    public function getColorForeground() {
        return $this->colorForeground;
    }
    
    
    public function setColorBackground($colorBackground) {
        $this->colorBackground = $this->getRGBArray($colorBackground);
         
        return $this;
    }
    
    
    public function getColorBackground() {
        return $this->colorBackground;
    }
    
    
    public function setAccuracy($accuracy) {
        $this->accuracy = $accuracy;
        
        return $this;
    }
    
    
    public function getAccuracy() {
        return $this->accuracy;
    }
    
    
    public function setWidth($width) {
        $this->width = $width;
        
        return $this;
    }
    
    
    public function getWidth() {
        return $this->width;
    }
    
    
    public function setHeight($height) {
        $this->height = $height;
        
        return $this;
    }
    
    
    public function getHeight() {
        return $this->height;
    }
    
    
    private function getRGBArray($rgb) {
        if (is_null($rgb)) return $rgb;
        
        return $this->html2rgb($rgb);
    }
    
    
    private function read() {
        $handle = fopen($this->getFile(), 'rb');
        
        if (!$handle) {
            die('no file handle');
        }
        
        $heading[] = fread($handle, 4);
        $heading[] = bin2hex(fread ($handle, 4));
        $heading[] = fread($handle, 4);
        $heading[] = fread($handle, 4);
        $heading[] = bin2hex(fread($handle, 4));
        $heading[] = bin2hex(fread($handle, 2));
        $heading[] = bin2hex(fread($handle, 2));
        $heading[] = bin2hex(fread($handle, 4));
        $heading[] = bin2hex(fread($handle, 4));
        $heading[] = bin2hex(fread($handle, 2));
        $heading[] = bin2hex(fread($handle, 2));
        $heading[] = fread($handle, 4);
        $heading[] = bin2hex(fread($handle, 4));
    
        // if ($heading[5] != '0100') die("ERROR: wave file should be a PCM file");
    
        $peek = hexdec(substr($heading[10], 0, 2));
        $byte = $peek / self::BYTE;
        $channel = hexdec(substr($heading[6], 0, 2));
        
        // point = one data point (pixel), WIDTH total
        // block = one block, there are $accuracy blocks per point
        // chunk = one data point 8 or 16 bit, mono or stereo
        $fileSize  = filesize($this->getFile());
        $chunkSize = $byte * $channel;
        
        if (!$chunkSize) {
            die('something wrong with Chunk size');
        }
        
        $fileChunks = ($fileSize - self::OFFSET) / $chunkSize;
        if ($fileChunks < $this->getWidth()) { 
            $this->setWidth($fileChunks);
        }
        
        $accuracy = ($fileChunks < $this->getWidth() * $this->getAccuracy()) ? 1 : $this->getAccuracy();
        $blockChunks = $fileChunks / ($this->getWidth() * $accuracy);
        
        $blocks = array();
        $points = 0;
        $currentFilePosition = self::OFFSET;
        fseek($handle, self::OFFSET);
    
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Read the data points and draw the image
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        
        while(!feof($handle)) {
            // The next file position is the float value rounded to the closest chunk
            // Read the next block, take the first value (of the first channel)
            $realPositionDiff = @(($currentFilePosition - self::OFFSET) % $chunkSize);
            if ($realPositionDiff > ($chunkSize / 2))
                $realPositionDiff -= $chunkSize;
            
            fseek($handle, $currentFilePosition - $realPositionDiff);
            $chunk = fread($handle, $chunkSize);
            
            //empty stream after read.. end of file usually.
            if (feof($handle) && !strlen($chunk)) 
                break;
            
            $currentFilePosition += $blockChunks * $chunkSize;
            
            $blocks[] = ($byte == 1) ? ord($chunk[0]) : ord($chunk[1]) ^ 128; // 8 bit vs 16 bit
            
            // Do we have enough blocks for the current point?
            if (count($blocks) >= $accuracy) {
                // Calculate the mean and add the peak value to the array of blocks
                sort($blocks);
                
                $mean = (count($blocks) % 2) ? 
                    $blocks[(count($blocks) - 1) / 2] : 
                    ($blocks[count($blocks) / 2] + $blocks[count($blocks) / 2 - 1]) / 2;
                
                $point = ($mean > 127) ? array_pop($blocks) : array_shift($blocks);
                $blocks = array();
                
                $this->spectrumData[] = round($point * $this->getHeight() / 255);
                
                $points++;
            }
        }
        
        // close and cleanup
        fclose($handle);
        
        return $this;
    }
    
    
    public function png($width, $height, $isFullView = true, $background = null, $foreground) {
        $heightMultiplier = (true === $isFullView) ? 1 : 2;

        $this->setWidth($width)
             ->setHeight($height)
             ->setColorForeground($foreground)
             ->setColorBackground($background);
        
        $canvas = $this->getCanvas();
        $foreground = $this->getColorForeground();
        $spectrumData = $this->getSpectrumData();
        
        foreach ($spectrumData as $x => $lineHeight) {
            $y1 = (0 + ($this->getHeight() - $lineHeight)) * $heightMultiplier;
            $y2 = ($this->getHeight() - ($this->getHeight() - $lineHeight)) * $heightMultiplier;
            
            $lineColor = imagecolorallocate($canvas, $foreground['r'], $foreground['g'], $foreground['b']);
            
            // draw the line on the image using the $v value and centering it vertically on the canvas
            imageline($canvas, $x, $y1, $x, $y2, $lineColor);
        }
        
        header('Content-Type: image/png');
        
        ob_start();
        ob_clean();
        imagepng($canvas);
        
        $image = ob_get_contents();
        
        ob_end_clean();
        
        imagedestroy($canvas);

        return $image;
    }
    
    
    private function getCanvas() {
        $background = $this->getColorBackground();
        
        // create original image width based on amount of detail
        // each waveform to be processed with be $height high, but will be condensed
        // and resized later (if specified)
        $canvas = imagecreatetruecolor($this->getWidth(), $this->getHeight());
        
        // fill background of image
        if (is_null($background)) {
            // transparent background specified
            imagesavealpha($canvas, true);
            $transparentBgColor = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefill($canvas, 0, 0, $transparentBgColor);
        } else {
            $bgFill = imagecolorallocate($canvas, $background['r'], $background['g'], $background['b']);
            imagefilledrectangle($canvas, 0, 0, $this->getWidth(), $this->getHeight(), $bgFill);
        }
        
        return $canvas;
    }
    
    
    private function getSpectrumData() {
        if (0 === sizeof($this->spectrumData)) {
            $this->read();
        }
        
        return $this->spectrumData;
    }
    
    
    private function getTmpDir() {
        return $this->tmpDir;
    }
    
    private function setTmpDir($tmpDir) {
        $this->tmpDir = $tmpDir;
        
        return $this;
    }
    
    
    private function getTmpFilename() {
        if (is_null($this->tmpFilename))
            $this->tmpFilename = substr(md5(time()), 0, 10);
        
        return $this->tmpFilename;
    }
    
    
    /**
     * Great function slightly modified as posted by Minux at
     * http://forums.clantemplates.com/showthread.php?t=133805
    */
    private function html2rgb($hexColor) {
        $hexColor = ('#' === $hexColor[0]) ? substr($hexColor, 1, 6) : substr($hexColor, 0, 6);
        
        list($r, $g, $b) = array_map('hexdec', str_split($hexColor, 2));
        
        return array(
            'r' => $r,
            'g' => $g,
            'b' => $b
        );
    }
    
    
    private function getExt($file) {
        return end(explode('.', $file));
    }
    
    
    private function getTmpFilePath() {
        return $this->getTmpDir().$this->getTmpFilename();
    }
    
    
    private function getConvertedWav() {
        $tmpFilePath = $this->getTmpFilePath();
        $wav = $tmpFilePath .'.wav';
        $mp3 = $tmpFilePath .'.mp3';
        
        if (!file_exists($wav)) {
            $convertTypeToMp3_8bit = self::LAME_BIN .' "'.$this->getFile().'" -m m -S -f -b 16 --resample 8 '.$mp3;
            $convertMp3ToWav = self::LAME_BIN .' -S --decode '. $mp3 .' '. $wav;
            
            exec($convertTypeToMp3_8bit .' && '. $convertMp3ToWav);
            
            //remove resampling to 8bit, useless from this point..
            @unlink($mp3);
        }
        
        return $wav;
    }
    
    
    public function tearDown() {
        @unlink($this->getTmpFilePath() .'.wav');
    }
}
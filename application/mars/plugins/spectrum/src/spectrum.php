<?php
namespace mars\plugins\spectrum
{
    use \mars\Loader;
    use \mars\Object;
    use \mars\utils\File;
    use \mars\utils\Config;
    use \Waveform;
    
    // loads waveform library.
    $path = dirname(dirname(__FILE__)).'/lib/waveform.php';
    Loader::create()->load($path);
    
    
    /**
     * Spectrum generator plugin.
     * 
     * Responsible for generating the audio spectrum image for 2 modes - active and passive.
     * Both are actually the same but if 2 diffrent colors to one be used as background the other one to indicate progress.
     * 
     * Images are generated using a 3rd party library. This wrapper makes it easier to replace it if needed and add more functionally right
     */
    class Spectrum extends Object
    {
        /* private */
        private $config = null;
        
        /* private */
        private $mimeTypes = array(
            'png' => 'image/png'
        );
        
        private $allowedTypes = array(
            'active',
            'progress'
        );
        
        /**
         * Generates a png image according to configuration for both types (active/progress)
         * 
         * @todo rename 'active' to something more descriptive.
         * @return string png file output
         */
        public function waveform($songID, $audioFile, $type)
        {
            $this->assert(in_array($type, $this->allowedTypes), 'Request type is NOT allowed, '.$type);
            
            $config = Config::create();
            $pngFile = $config->read('waveform.cache').$songID .'_'. $type .'.png';
            
            //check if cache exists and return, else contunie running and generate.
            $png = File::create($pngFile); 
            if ($png->exists())
            {
                return $png->read();
            }
            
            $wave = new Waveform($config->read('waveform.tmp'));
            $wave->setFile($audioFile);
            
            switch($type)
            {
                case 'active':
                    $spectrumImage = $wave->png(
                        $config->read('waveform.width'),
                        $config->read('waveform.height'),
                        $config->read('waveform.isFullView'),
                        $config->read('waveform.background'),
                        $config->read('waveform.foregroundActive')
                    );
                    
                    break;
                
                case 'progress':
                    $spectrumImage = $wave->png(
                        $config->read('waveform.width'),
                        $config->read('waveform.height'),
                        $config->read('waveform.isFullView'),
                        $config->read('waveform.background'),
                        $config->read('waveform.foregroundProgress')
                    );
                    break;
            }
            
            $wave->tearDown();
            $png->write($spectrumImage);
            
            return $spectrumImage;
        }
    }
}
<?php 
namespace mars\plugins\mysql\utils
{
    use \mars\Object;
    use \RedBean_IModelFormatter;
    
    class NamespaceFormatter extends Object implements RedBean_IModelFormatter
    {
        public function formatModel($model)
        {
                return '\\'.'jukebox'.'\\'.'model'.'\\'.$model.'Model';
         }
    }
}
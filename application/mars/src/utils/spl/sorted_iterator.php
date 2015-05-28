<?php
namespace mars\utils\spl
{
    use \SplHeap;
    
    /**
     * This class handles a spl extras
     * 
     * @todo write proper documentation
     */
    class SortedIterator extends SplHeap
    {
        public function __construct($iterator)
        {
            foreach ($iterator as $item)
            {
                $this->insert($item);
            }
        }
        
        
        public function compare($b,$a)
        {
            return strcmp($a->getRealpath(), $b->getRealpath());
        }
    }
}
<?php
Class Id3
{
    private $_FileReader;
    private $_ID3Array;
    private $_bad_hashID = '8f923b6e1ab957ae7e4d39766cadc48a';
    
    public $ID3Tags = array(
        "AENC" =>  "Audio encryption",
        //"APIC" =>  "Attached picture",
        "COMM" =>  "Comments",
        "COMR" =>  "Commercial frame",
        "ENCR" =>  "Encryption method registration",
        "EQUA" =>  "Equalization",
        "ETCO" =>  "Event timing codes",
        "GEOB" =>  "General encapsulated object",
        "GRID" =>  "Group identification registration",
        "IPLS" =>  "Involved people list",
        "LINK" =>  "Linked information",
        "MCDI" =>  "Music CD identifier",
        "MLLT" =>  "MPEG location lookup table",
        "OWNE" =>  "Ownership frame",
        "PRIV" =>  "Private frame",
        "PCNT" =>  "Play counter",
        "POPM" =>  "Popularimeter",
        "POSS" =>  "Position synchronisation frame",
        "RBUF" =>  "Recommended buffer size",
        "RVAD" =>  "Relative volume adjustment",
        "RVRB" =>  "Reverb",
        "SYLT" =>  "Synchronized lyric/text",
        "SYTC" =>  "Synchronized tempo codes",
        "TALB" =>  "Album/Movie/Show title",
        "TBPM" =>  "BPM (beats per minute)",
        "TCOM" =>  "Composer",
        "TCON" =>  "Content type",
        "TCOP" =>  "Copyright message",
        "TDAT" =>  "Date",
        "TDLY" =>  "Playlist delay",
        "TENC" =>  "Encoded by",
        "TEXT" =>  "Lyricist/Text writer",
        "TFLT" =>  "File type",
        "TIME" =>  "Time",
        "TIT1" =>  "Content group description",
        "TIT2" =>  "Title/songname/content description",
        "TIT3" =>  "Subtitle/Description refinement",
        "TKEY" =>  "Initial key",
        "TLAN" =>  "Language(s)",
        "TLEN" =>  "Length",
        "TMED" =>  "Media type",
        "TOAL" =>  "Original album/movie/show title",
        "TOFN" =>  "Original filename",
        "TOLY" =>  "Original lyricist(s)/text writer(s)",
        "TOPE" =>  "Original artist(s)/performer(s)",
        "TORY" =>  "Original release year",
        "TOWN" =>  "File owner/licensee",
        "TPE1" =>  "Lead performer(s)/Soloist(s)",
        "TPE2" =>  "Band/orchestra/accompaniment",
        "TPE3" =>  "Conductor/performer refinement",
        "TPE4" =>  "Interpreted, remixed, or otherwise modified by",
        "TPOS" =>  "Part of a set",
        "TPUB" =>  "Publisher",
        "TRCK" =>  "Track number/Position in set",
        "TRDA" =>  "Recording dates",
        "TRSN" =>  "Internet radio station name",
        "TRSO" =>  "Internet radio station owner",
        "TSIZ" =>  "Size",
        "TSRC" =>  "ISRC (international standard recording code)",
        "TSSE" =>  "Software/Hardware and settings used for encoding",
        "TYER" =>  "Year",
        "TXXX" =>  "User defined text information frame",
        "UFID" =>  "Unique file identifier",
        "USER" =>  "Terms of use",
        "USLT" =>  "Unsychronized lyric/text transcription",
        "WCOM" =>  "Commercial information",
        "WCOP" =>  "Copyright/Legal information",
        "WOAF" =>  "Official audio file webpage",
        "WOAR" =>  "Official artist/performer webpage",
        "WOAS" =>  "Official audio source webpage",
        "WORS" =>  "Official internet radio station homepage",
        "WPAY" =>  "Payment",
        "WPUB" =>  "Publishers official webpage",
        "WXXX" =>  "User defined URL link frame"
    );


    public function __construct($fileHandle)
    {
        fseek($fileHandle, 0);
        
        $this->_FileReader = new BinaryFileReader($fileHandle, array(
            'ID3' => array(BinaryFileReader::FIXED, 3),
            'version' => array(BinaryFileReader::FIXED, 2),
            'flag' => array(BinaryFileReader::FIXED, 1),
            'sizeTag' => array(BinaryFileReader::FIXED, 4, BinaryFileReader::INT),
        ));

        $this->_FileReader->read();
    }
        

    public function readAllTags()
    {
        $bytesPos = 10; //From headers

        $this->_FileReader->setMap(array(
            'frameID' => array(BinaryFileReader::FIXED, 4),
            'size' => array(BinaryFileReader::FIXED, 4, BinaryFileReader::INT),
            'flag' => array(BinaryFileReader::FIXED, 2),
            'body' => array(BinaryFileReader::SIZE_OF, 'size')
        ));

        while (($file_data = $this->_FileReader->read()))
        {
            if (!in_array($file_data->frameID, array_keys($this->ID3Tags)))
                break;
            
            $invalidUTF8 = md5(substr($file_data->body, 0, 3));
            if ($this->_bad_hashID === $invalidUTF8)
            {
                $file_data->body = substr($file_data->body, 3);
            }
            
            $this->_ID3Array[$file_data->frameID] = array(
                 'position' => $bytesPos,
                 'size' => $file_data->size,
                 'body' => $file_data->body
            );
            
            $bytesPos += 4 + 4 + 2 + $file_data->size;      
        }

        return $this;
    }
    

    public function getID3Array()
    {
        return array(
            'title' => (isset($this->_ID3Array['TIT2'])) ? $this->_ID3Array['TIT2']['body'] : '',
            'artist' => (isset($this->_ID3Array['TPE1'])) ? $this->_ID3Array['TPE1']['body'] : '',
            'album' => (isset($this->_ID3Array['TALB'])) ? $this->_ID3Array['TALB']['body'] : '',
            'year' => (isset($this->_ID3Array['TYER'])) ? (int) $this->_ID3Array['TYER']['body'] : 0,
            'track' => (isset($this->_ID3Array['TRCK'])) ? $this->_ID3Array['TRCK']['body'] : '',
            'genre' => (isset($this->_ID3Array['TCON'])) ? ucfirst(strtolower($this->_ID3Array['TCON']['body'])) : ''
        );
    }
        

    public function getImage()
    {
        $fp = fopen('data://text/plain;base64,'.base64_encode($this->_ID3Array["APIC"]["body"]), 'rb'); //Create an artificial stream from Image data

        $fileReader = new BinaryFileReader($fp, array(
            'textEncoding' => array(BinaryFileReader::FIXED, 1),
            'mimeType' => array(BinaryFileReader::NULL_TERMINATED),
            'fileName' => array(BinaryFileReader::NULL_TERMINATED),
            'ContentDesc' => array(BinaryFileReader::NULL_TERMINATED),
            'binaryData' => array(BinaryFileReader::EOF_TERMINATED))
        );
        
        $imageData = $fileReader->read();

        return array($imageData->mimeType, $imageData->binaryData);
    }

}
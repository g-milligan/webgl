<?php
    //string constants
    function str($key){
        $str='';
        switch ($key) {
            case 'walk-through':
                $str='walk-through';
                break;
            case 'walkthrough.xml':
                $str='walkthrough.xml';
                break;
            case 'canvas_root':
                $str='canvas/';
                break;
        }
        return $str;
    }
    //http://, https://, file:///
    function current_protocol() {
        $ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true:false;
        $sp = strtolower($_SERVER['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        if (strpos($protocol, 'http') === 0) {
           $protocol .= '://'; 
        }
        return $protocol;
    }
    //http://g2.webgl:8080/
    function current_domain() {
        $currentDomain = current_protocol() . $_SERVER['HTTP_HOST'];
        if (strpos($currentDomain, '/') !== strlen($currentDomain) - strlen('/')) {
            $currentDomain .= '/';
        }
        return $currentDomain;
    }
    //get the value for a walkthrough
    function getWalkthroughVal($doc=false, $valKey=false){
        $val='';
        if($valKey){
            //if a directory name was passed instead of an XML document
            if(is_string($doc)){
                //get the xml document for this directory
                $doc = getWalkthroughDoc($doc);
            }
            if($doc){
                switch ($valKey) {
                    case 'active':
                        $val=true;
                        //get attribute value
                        $activeAttr=$doc->documentElement->getAttribute('active');
                        if(!$activeAttr){$activeAttr='true';}
                        $activeAttr=strtolower($activeAttr);
                        $activeAttr=trim($activeAttr);
                        //if active=false
                        if($activeAttr=='false'){$val=false;}
                        break;
                    case 'title':
                        $rootNode=$doc->documentElement;
                        //look for the first <title> 
                        foreach($rootNode->childNodes as $child) {
                            //if XML dom node
                            if($child->nodeType==1){
                                if($child->nodeName == 'title'){
                                    $val = $child->nodeValue.'';
                                    $val = trim($val);
                                    $val = str_replace('<', '&lt;', $val);
                                    $val = str_replace('>', '&gt;', $val);
                                    //force the search loop to end
                                    break;
                                }
                            }
                        }
                        break;
                    case 'url':
                        $val=$doc->documentURI;
                        $rootFolder='/'.str('walk-through').'/';
                        //if the path contains the root walkthrough folder
                        if(strpos($val, $rootFolder)!==false){
                            //strip off everything to the left of the root folder
                            $val = substr($val, strpos($val, $rootFolder)+1);
                            //if the xml file name is at the end of the path
                            $xmlFileName = '/'.str('walkthrough.xml');
                            if(strrpos($val, $xmlFileName)!==false){
                                //strip off the XML file name
                                $val = substr($val, 0, strrpos($val, $xmlFileName));
                                //get the walkthrough dir's name
                                $dirName = basename($val);
                                //strip off the $dirName
                                $val = substr($val, 0, strrpos($val, '/'.$dirName)+1);
                                //prepend the domain of the site to make it an absolute path
                                $val = current_domain().$val.'?id='.$dirName;
                            }
                        }
                        break;
                    case 'summary':
                        $rootNode=$doc->documentElement;
                        //look for the first <summary> 
                        foreach($rootNode->childNodes as $child) {
                            //if XML dom node
                            if($child->nodeType==1){
                                if($child->nodeName == 'summary'){
                                    $val = $child->nodeValue.'';
                                    $val = trim($val);
                                    //force the search loop to end
                                    break;
                                }
                            }
                        }
                        break;
                    case 'scripts':
                        $val=array();
                        $rootNode=$doc->documentElement;
                        $scriptsNode=false;
                        //look for the first <scripts> 
                        foreach($rootNode->childNodes as $child) {
                            //if XML dom node
                            if($child->nodeType==1){
                                if($child->nodeName == 'scripts'){
                                    $scriptsNode=$child;
                                    //force the search loop to end
                                    break;
                                }
                            }
                        }
                        //if <scripts> node found
                        if($scriptsNode){
                            //for each <script> node
                            foreach($scriptsNode->childNodes as $scriptNode) {
                                //if XML dom node
                                if($scriptNode->nodeType==1){
                                    //if this script is NOT disabled
                                    $isActive=$scriptNode->getAttribute('active');
                                    if(!$isActive){$isActive='';}$isActive=trim($isActive);
                                    $isActive=strtolower($isActive);
                                    if($isActive!='false'){
                                        //if this script has an id
                                        $sId=$scriptNode->getAttribute('id');
                                        if(!$sId){$sId='';}$sId=trim($sId);
                                        if($sId!=''){
                                            $path = '';$summary = '';
                                            //look for the nodes for this script, eg: <path> 
                                            foreach($scriptNode->childNodes as $child) {
                                                //if XML dom node
                                                if($child->nodeType==1){
                                                    switch($child->nodeName){
                                                        case 'path':
                                                            //get the path value
                                                            $path = $child->nodeValue;
                                                            if(!$path){$path='';}
                                                            $path = trim($path);
                                                            break;
                                                        case 'summary':
                                                            //get the summary value
                                                            $summary = $child->nodeValue;
                                                            if(!$summary){$summary='';}
                                                            $summary = trim($summary);
                                                            break;
                                                    }
                                                }
                                            }
                                            //if found <path> 
                                            if($path!=''){
                                                //get just the file name without the path
                                                $file=$path;
                                                if(strrpos($file, '/')!==false){
                                                    $file=substr($file, strrpos($file, '/')+1);
                                                }
                                                //get just the root without the file
                                                $root=$path;
                                                if(strrpos($root, '/')!==false){
                                                    $root=substr($root, 0, strrpos($root, '/')+1);
                                                }else{$root='/';}
                                                //get the file url...
                                                $url=$path;
                                                //if source path starts at the root
                                                if(strpos($path, '/')===0){
                                                    //add domain to the front of url
                                                    $url = current_domain().substr($url, 1);
                                                }else{
                                                    //source path is relative to current $dirName...
                                                    //add full absolute path to walkthrough source
                                                    $url = current_domain().str('walk-through').'/{dirName}/'.$url;
                                                }
                                                //get the url without the domain
                                                $rel_url=$url;
                                                $rel_url=substr($rel_url, strlen(current_domain()));
                                                //add the script values
                                                $val[$sId] = array(
                                                    'id'=>$sId,
                                                    'path'=>$path,
                                                    'root'=>$root,
                                                    'file'=>$file,
                                                    'url'=>$url,
                                                    'rel_url'=>'/'.$rel_url,
                                                    'summary'=>$summary
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 'steps':
                        $val=getRecursiveWalkthroughSteps($doc->documentElement);
                        break;
                }
            }
        }
        return $val;
    }

    function getRecursiveWalkthroughSteps($rootNode,$hasSteps=true){
        $steps=false;
        if($hasSteps){
            $stepsNode=false;
            //look for the first <steps> 
            foreach($rootNode->childNodes as $child) {
                //if XML dom node
                if($child->nodeType==1){
                    if($child->nodeName == 'steps'){
                        $stepsNode=$child;
                        //force the search loop to end
                        break;
                    }
                }
            }
            //if <steps> node found
            if($stepsNode){
                //for each <step> node
                foreach($stepsNode->childNodes as $stepNode) {
                    //if XML dom node
                    if($stepNode->nodeType==1){
                        //if this step is NOT disabled
                        $isActive=$stepNode->getAttribute('active');
                        if(!$isActive){$isActive='';}$isActive=trim($isActive);
                        $isActive=strtolower($isActive);
                        if($isActive!='false'){
                            if(!$steps){$steps=array();}
                            $title = '';$hasSubSteps=false;
                            //look for the nodes for this step, eg: <title> 
                            foreach($stepNode->childNodes as $child) {
                                //if XML dom node
                                if($child->nodeType==1){
                                    switch($child->nodeName){
                                        case 'title':
                                            //get the title value
                                            $title = $child->nodeValue;
                                            if(!$title){$title='';}
                                            $title = trim($title);
                                            $title = str_replace('<', '&lt;', $title);
                                            $title = str_replace('>', '&gt;', $title);
                                            break;
                                        case 'steps':
                                            $hasSubSteps=true;
                                            break;
                                            //***
                                    }
                                }
                            }
                            //if found <title> 
                            if($title!=''){
                                //add the step values
                                array_push($steps, array(
                                    'title'=>$title,
                                    'steps'=>getRecursiveWalkthroughSteps($stepNode,$hasSubSteps)
                                ));
                            }
                        }
                    }
                }
            }
        }
        return $steps;
    }

    //get the xml document for a walkthrough.xml
    function getWalkthroughDoc($dirName=false){
        $doc = false;
        if($dirName){
            //get the walkthrough's xml file path
            $xmlFilePath=$_SERVER['DOCUMENT_ROOT'].'/'.str('walk-through').'/'.$dirName.'/'.str('walkthrough.xml');
            //if the walkthrough's xml file exists
            if (file_exists($xmlFilePath)) {
                //load the xml document for this walkthrough
                $doc = new DOMDocument();
                $doc->load($xmlFilePath);
            }
        }
        return $doc;
    }

    //get a full list of walkthroughs
    function listWalkthroughs(){
        $html = '';
        
        //folder path
        $folderRoot=str('walk-through');
        //if the walkthrough root folder exists
        if (file_exists($folderRoot)) {
            $index=0;$isAlt=true;
            //for each folder under $folderRoot
            foreach (new DirectoryIterator($folderRoot) as $dirInfo) {
                //if this file IS a directory
                if(!$dirInfo->isDot()) {
                    //get the wolkthrough's dir name
                    $dirName = $dirInfo->getFilename();
                    //get the walkthrough document
                    $doc=getWalkthroughDoc($dirName);
                    //if the walkthrough xml file exists
                    if($doc){
                        //if first item
                        if($html==''){
                            $html .= '<ul class="walkthroughs-list">';
                        }
                        //check is alt
                        $altClass='';
                        if($isAlt){
                            $isAlt=false;
                        }else{
                            $altClass=' alt';
                            $isAlt=true;
                        }
                        //get the title
                        $title=getWalkthroughVal($doc,'title');
                        //if the walkthrough is active
                        if(getWalkthroughVal($doc,'active')){
                            //values
                            $url=getWalkthroughVal($doc,'url');
                            //html
                            $html.='<li class="item'.$altClass.'"><span class="num">'
                                .($index+1).'</span> <a href="'.$url.'">'.$title.'</a></li>';
                        }else{
                            //walkthrough not active...
                            $html.='<li class="item'.$altClass.' disabled"><span class="num">'
                                .($index+1).'</span> <span class="label">disabled</span> '.$title.'</li>';
                        }
                        //next index
                        $index++;
                    }
                }
            }
            //if there were any items
            if($html!=''){
                $html .= '</ul>';
            }
        }

        return $html;
    }
    
    //print the walkthrough script tags for a current walkthrough
    function includeWalkthroughScripts($dirName=false){
        $html='';
        //get the current directory name, by default
        if(!$dirName){$dirName=basename(getcwd());}
        //if directory was given
        if($dirName){
            //get the walkthrough document
            $doc=getWalkthroughDoc($dirName);
            //if the walkthrough xml file exists
            if($doc){
                //get newline from buffer
                ob_start();?>

<?php
                $newLine=ob_get_clean();
                //get the array of scripts
                $scripts=getWalkthroughVal($doc,'scripts');
                //for each script 
                foreach($scripts as $script){
                    //get the url of the script
                    $src = $script['rel_url'];
                    $src = str_replace('{dirName}', $dirName, $src);
                    //put the html together
                    $html .= '<script id="sid_'.$script['id']
                        .'" type="text/javascript" src="'.$src.'"></script> '.$newLine;
                }
            }else{
                $html .= '<!-- No walkthrough scripts found; no "'.str('walkthrough.xml').'" in this directory, "'.$dirName.'". -->';
            }
        }else{
            $html .= '<!-- No walkthrough scripts found; no $dirName specified. -->';
        }
        return $html;
    }

    function getScriptFoldersAsKey($scripts,$dirName=false){
        $folderArray=array();
        if($scripts){
            if(is_array($scripts)){
                //get the current directory name, by default
                if(!$dirName){$dirName=basename(getcwd());}
                //for each script 
                foreach($scripts as $script){
                    $root = $script['root'];
                    //if source root folder doesn't start at the site root
                    if(strpos($root, '/')===0){
                        //remove the starting /
                        $root = substr($root, 1);
                    }else{
                        //path is relative to current $dirName...
                        //add the root directory to the front of $root
                        $root = str('walk-through').'/'.$dirName.'/'.$root;
                    }
                    //if the array of folders doesn't already contain this directory key
                    if(!array_key_exists($root, $folderArray)){
                        //add this directory key
                        $folderArray[$root]=array();
                    }
                    //add this file name to the parent directory key
                    array_push($folderArray[$root],$script);
                }
            }
        }
        return $folderArray;
    }

?>
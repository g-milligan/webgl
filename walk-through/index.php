<?php require_once($_SERVER['DOCUMENT_ROOT'].'/php/functions.php');?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link type="text/css" rel="stylesheet" href="../res/css/styles.css" />

<script type="text/javascript" src="../res/js/jquery.js"></script>
<script type="text/javascript" src="../res/js/steps.js"></script>

<?php 
    //try to get $_dirName
    $_dirName=false;
    if(isset($_REQUEST['id'])) {
        //get the walkthrough folder name to use
        $_dirName=$_REQUEST['id'];
    }else{
        //no directory specified... redirect to home page
        header('Location: '.current_domain());
        die();
    }
    //try to get $_doc
    $_doc=getWalkthroughDoc($_dirName);
    if(!$_doc){
        //no XML document... redirect to home page
        header('Location: '.current_domain());
        die();
    }
    //walkthrough title
    $_title=getWalkthroughVal($_doc, 'title');
    //walkthrough summary
    $_summary=getWalkthroughVal($_doc, 'summary');
    //walkthrough steps
    $_steps=getWalkthroughVal($_doc, 'steps');
    //walkthrough scripts
    $_scripts=getWalkthroughVal($_doc, 'scripts');
    //create a new array that uses script parent folders as item keys
    $_folderScripts=getScriptFoldersAsKey($_scripts,$_dirName);
    //next and previous documents
    $_prevDoc=false;$_nextDoc=false;
    $_dirNameInt=intval($_dirName);
    if($_dirNameInt!==false){
        $_prevDoc=getWalkthroughDoc($_dirNameInt-1);
        $_nextDoc=getWalkthroughDoc($_dirNameInt+1);
    }
    //get the next or previous button html
    function getNextPrevButton($doc, $prevOrNext){
        $html='';
        $exists=false; $url='';$txt='';
        if($prevOrNext=='prev'){
            $txt='&lt; previous';
        }else{
            $txt='next &gt;';
        }
        //if there is a document for prev/next
        if($doc){
            if($prevOrNext=='prev'){
                $url=getWalkthroughVal($doc,'url');
            }else{
                $url=getWalkthroughVal($doc,'url');
            }
            $exists=true;
        }
        //if the document exists
        if($exists){
            $html .= '<a href="'.$url.'" class="'.$prevOrNext.' btn">'.$txt.'</a>';
        }else{
            $html .= '<a href="'.current_domain().'" class="home '.$prevOrNext.' btn">Home</a>';
        }
        return $html;
    }
    //get the html for all of the steps
    function getStepHtml($_steps,$anchorStr='step'){
        $bodyHtml='';$previewHtml='';
        //if there are any steps
        if($_steps){
            //for each step
            $_stepNum=1;
            foreach($_steps as $_step){
                //BODY HTML======================
                //get the level of this step
                $stepLevels=explode('_', $anchorStr);
                $levelCount=count($stepLevels);
                //print step html
                $bodyHtml.='<div class="step-wrap level'.$levelCount.'">';
                $bodyHtml.='<a class="anchor level'.$levelCount.'" name="'.$anchorStr.$_stepNum.'"></a>';
                $bodyHtml.='<h'.$levelCount.' class="step-title">'.$_step['title'].'</h'.$levelCount.'>';
                $bodyHtml.='<div class="step-body">';
                //*** step content
                //recursive... get sub-steps
                $_subHtml=getStepHtml($_step['steps'],$anchorStr.$_stepNum.'_');
                $bodyHtml.=$_subHtml['body'];
                $bodyHtml.='</div>';
                $bodyHtml.='</div>';
                //PREVIEW HTML======================
                //if first step in the level
                if($_stepNum==1){
                    $previewHtml.='<ul class="level'.$levelCount.'">';
                }
                //step item
                $previewHtml.='<li class="level'.$levelCount.'"><a href="#'.$anchorStr.$_stepNum.'">'.$_step['title'].'</a>';
                //sub items below this item
                $previewHtml.=$_subHtml['preview'];
                $previewHtml.='</li>';
                //next step index
                $_stepNum++;
            }
            //if there were any previewed steps
            if($previewHtml!=''){
                //end the preview html
                $previewHtml.='</ul>';
            }
        }
        $retArray=array('body'=>$bodyHtml,'preview'=>$previewHtml);
        return $retArray;
    }
    //build the html for listing the script files used in this tutorial
    function getSourceFilesHtml($_folderScripts,$_dirName){
        $html='';
        //if there are any folders
        $folderCount=count($_folderScripts);
        if($folderCount>0){
            $html.='<h2>Source files</h2>';
            $html.='<p>feel free to examine or download: </p>';
            $html.='<ul class="sources">';
            //show the canvas.html file
            $html.='<li>';
            $html.='<span class="folder">'.str('walk-through').'/'.$_dirName.'/</span>';
            $html.='<ul>';
            $html.='<li><a target="_blank" href="'.current_domain()
                .str('walk-through').'/'.$_dirName.'/index">index.htm</a></li>';
            $html.='</ul>';
            $html.='</li>';
            //for each unique folder path (that contains at least one source file)
            foreach($_folderScripts as $folder => $files){
                $html.='<li>';
                $html.='<span class="folder">'.$folder.'</span>';
                $html.='<ul>';
                //for each source file inside this folder
                foreach($files as $file){
                    //get the src url for this file
                    $src=$file['url'];
                    $src = str_replace('{dirName}', $_dirName, $src);
                    //print the html for this file
                    $html.='<li><a target="_blank" href="'.$src.'">'.$file['file'].'</a></li>';
                }
                $html.='</ul>';
                $html.='</li>';
            }
            //end sources list
            $html.='</ul>';
        }
        return $html;
    }
?>

<title>WebGL Tutorial | <?php echo $_title; ?></title>
</head>

<body id="body">  
    <?php $_stepHtml = getStepHtml($_steps); //get the html for all of the steps ?>
    <h1 class="main-title"><?php echo $_title; ?></h1>
    <div class="intro">
        <div class="main-summary"><?php echo $_summary; ?></div>
        <div class="source-files"><?php echo getSourceFilesHtml($_folderScripts,$_dirName); ?></div>
        <div class="toc"><h2>In this walkthrough</h2><?php echo $_stepHtml['preview']; ?></div>
    </div>
    <div class="stepsWrap"><?php echo $_stepHtml['body']; //print the body step html ?></div>
    <div id="hud">
        <div class="title">
            <?php echo getNextPrevButton($_prevDoc, 'prev'); ?>
            <h1><span class="num"><?php echo $_dirName; ?></span> <?php echo $_title; ?></h1>
            <?php echo getNextPrevButton($_nextDoc, 'next'); ?>
        </div>
        <div class="steps-wrap">
            <ul class="steps">
                <?php 
                    //for each top-level step
                    $_stepNum=1;
                    foreach($_steps as $_step){
                        $firstClass='';
                        if($_stepNum==1){$firstClass='first ';}
                        //print the step item
                        echo '<li class="'.$firstClass.'step"><a href="#step'.$_stepNum.'">'.$_step['title']
                            .'</a><span class="bar"><span class="arrow"></span></span></li>';
                        $_stepNum++;
                    }
                ?>
            </ul>
        </div>
    </div>  
</body>
</html>

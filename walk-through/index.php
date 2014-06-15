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
    
    //next and previous documents
    $_prevDoc=false;$_nextDoc=false;
    $_dirNameInt=intval($_dirName);
    if($_dirNameInt!==false){
        $_prevDoc=getWalkthroughDoc($_dirNameInt-1);
        $_nextDoc=getWalkthroughDoc($_dirNameInt+1);
    }
    
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
    
    function getStepHtml($_steps,$anchorStr='step'){
        $html='';
        //if there are any steps
        if($_steps){
            //for each step
            $_stepNum=1;
            foreach($_steps as $_step){
                //get the level of this step
                $stepLevels=explode('_', $anchorStr);
                $levelCount=count($stepLevels);
                //print step html
                $html.='<div class="step-wrap level'.$levelCount.'">';
                $html.='<a class="anchor level'.$levelCount.'" name="'.$anchorStr.$_stepNum.'"></a>';
                $html.='<h1 class="step-title">'.$_step['title'].'</h1>';
                $html.='<div class="step-body">';
                //***
                //recursive... get sub-steps
                $html.=getStepHtml($_step['steps'],$anchorStr.$_stepNum.'_');
                $html.='</div>';
                $html.='</div>';
                //next step index
                $_stepNum++;
            }
        }
        return $html;
    }
?>

<title>WebGL Tutorial | <?php echo $_title; ?></title>
</head>

<body id="body">  
    <h1 class="main-title"><?php echo $_title; ?></h1>
    <p class="main-summary"><?php echo $_summary; ?></p>
    <?php echo getStepHtml($_steps); ?>
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

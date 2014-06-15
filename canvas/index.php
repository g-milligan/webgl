<?php require_once($_SERVER['DOCUMENT_ROOT'].'/php/functions.php');?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link type="text/css" rel="stylesheet" href="../res/css/canvas.css" />

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
    
    //print the script includes for this canvas
    echo includeWalkthroughScripts($_dirName);
?>

<title>WebGL Demo | <?php echo getWalkthroughVal($_doc, 'title');?></title>
</head>
<body onload="javascript:webglStart();">  
    
    <canvas id="canvas" class="canvas">
        Your browser doesn't support canvas (sadface)...
    </canvas>
      
</body>
</html>
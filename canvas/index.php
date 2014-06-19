<?php require_once($_SERVER['DOCUMENT_ROOT'].'/php/functions.php');?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<style type="text/css">
    body{padding:0px;margin:0px;text-align:center;}
    canvas#canvas{width:100%;height:100%;}
    .error{padding:10px;margin:10px;background-color:rgba(255,100,0,0.3);border-radius:10px;display:inline-block;font-family: "Lucida Console", "Lucida Sans Typewriter", Monaco, "Bitstream Vera Sans Mono", monospace;font-size:13px;text-transform: uppercase;text-shadow:-1px 1px rgba(0,100,200,.2);box-shadow:-2px 2px 5px rgba(0,0,0,.3);text-decoration:none;}
    .error a,.error a:visited{text-decoration:none;color:rgb(32, 46, 202);
        -webkit-transition: color .2s linear;-moz-transition: color .2s linear;-ms-transition: color .2s linear;-o-transition: color .2s linear;transition: color .2s linear;}
    .error a:hover{text-decoration:none;color:rgb(221, 38, 38);}
    .error a:active{text-decoration:none;}
    .error ul{padding:0px 0px 0px 15px;margin:15px 0px 0px 0px;display:inline-block;text-align:center;}
    .error ul li{list-style:none;}
</style>

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
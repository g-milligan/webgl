//https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
//http://blogoben.wordpress.com/webgl-basics/
//http://learningwebgl.com/blog/?p=28
//http://www.khronos.org/registry/webgl/specs/1.0/

var canvas;
var gl;
var squareVerticesBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var perspectiveMatrix;

function webglStart(){
	//get the <canvas> element
	canvas = document.getElementById('canvas');
	//internal function that can be reused to display different error messages during webGL setup
	var showErrMsg=function(msg){
		//remove canvas element
		canvas.parentNode.removeChild(canvas);
		//create error message 
		var msgNode = document.createElement('span');
		msgNode.innerHTML = msg;
		msgNode.setAttribute('class', 'error');
		//add the error message to the body
		document.body.appendChild(msgNode);
	};
	//check to see if the browser supports webgl
	if (window.WebGLRenderingContext) {
		//set the width and height of the canvas element to match that of the screen
		resizeCanvas();
		// browser supports WebGL...
		//if it's possible to get the webgl (not out of memory, etc...)
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (gl){
			//MAIN PROGRAM...
			//https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding_2D_content_to_a_WebGL_context
			
			gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
			gl.clearDepth(1.0);                 // Clear everything
			gl.enable(gl.DEPTH_TEST);           // Enable depth testing
			gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
			
			// Initialize the shaders; this is where all the lighting for the
			// vertices and so forth is established.
			
			initShaders();
			
			// Here's where we call the routine that builds all the objects
			// we'll be drawing.
			
			initBuffers();
			
			// Set up to draw the scene periodically.
			
			setInterval(drawScene, 15);
			
			//ADDITIONAL ERROR HANDLING MESSAGES...
		}else{
			//browser supports WebGL but initialization failed...
			showErrMsg('WebGL failed to load... <a href="http://get.webgl.org/troubleshooting" target="_blank">click to troubleshoot issue at get.webgl.org/troubleshooting</a>. <br /><br />Something as simple as the following may fix the issue: <br /><ul><li>Update your computer\'s graphics driver</li><li>Update your browser to the latest version</li></ul>');
		}
	}else{
		//browser doesn't support webgl...
		showErrMsg('Sorry, your browser doesn\'t support <a href="http://get.webgl.org/" target="_blank">WebGL (click for more info)</a>.');
	}
};

function initShaders() {
  var fragmentShader = getShader(gl, "fragment_shader");
  var vertexShader = getShader(gl, "vertex_shader");
  
  // Create the shader program
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(shaderProgram);
  
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShader(gl, id) {
	var theSource, shader;

	//get the inner text of the <script> which contains shader source code
	theSource = getShaderCode(id);
	
	if (id == "fragment_shader") {
    	shader = gl.createShader(gl.FRAGMENT_SHADER);
  	} else if (id == "vertex_shader") {
    	shader = gl.createShader(gl.VERTEX_SHADER);
  	} else {
     	// Unknown shader type
     	return null;
  	}
  
	gl.shaderSource(shader, theSource);
    
  // Compile the shader program
  gl.compileShader(shader);  
    
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      return null;  
  }
    
  return shader;
}

function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function resizeCanvas() {
   // only change the size of the canvas if the size it's being displayed
   // has changed.
   var width = canvas.clientWidth;
   var height = canvas.clientHeight;
   if (canvas.width != width ||
       canvas.height != height) {
     // Change the size of the canvas to match the size it's being displayed
     canvas.width = width;
     canvas.height = height;
	 
	 //if the context is initialized
	 if (gl){
		 //change the viewport origin...
		 gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	 }
   }
}

function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  	//realign the canvas dimensions with the actual dimensions influenced by the css
	resizeCanvas();
	//set the perspectiveMatrix
  perspectiveMatrix = makePerspective(45, canvas.clientWidth/canvas.clientHeight, 0.1, 100.0);

  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
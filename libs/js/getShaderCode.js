/*Get shader program code (string) from inside Javascript functions for easy access...
 * Note: this is a unique way of storing and accessing shader code.
 * It is not the only way to store and access shader code, nor is 
 * it required for every WebGL program.
 * For example, this code could also be stored inline, before or after the <canvas> element. Eg:
 * 
 * 		<script id="shader-fs" type="x-shader/x-fragment">
			void main(void) {
				gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			}
        </script>
        
		<script id="shader-vs" type="x-shader/x-vertex">
			attribute vec3 aVertexPosition;
			
			uniform mat4 uMVMatrix;
			uniform mat4 uPMatrix;
			
			void main(void) {
				gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
			}
        </script>
 */

//gets the contents of a function, eg: function functionName(){/* ...contents... */}
function getShaderCode(functionName){
	var functionContent = '';
	//if this function exists
	if(window.hasOwnProperty(functionName)){
		//get code inside the function object
		functionContent = window[functionName];
		functionContent = functionContent.toString();
		//strip off the function string
		var startCode = '{/*';var endCode = '*/}';
		//safari tries to be helpful by inserting a ';' at the end of the function code if there is not already a ';'
		if (functionContent.lastIndexOf(endCode) == -1) {endCode='*/;}';}
		//strip off everything left of, and including startCode
		functionContent = functionContent.substring(functionContent.indexOf(startCode) + startCode.length);
		//strip off everything right of, and including endCode
		functionContent = functionContent.substring(0, functionContent.lastIndexOf(endCode));
		functionContent = functionContent.trim();
	}
	return functionContent;
}

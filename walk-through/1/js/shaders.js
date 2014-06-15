/*Wrapping shader programs inside Javascript functions for easy access...
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

function fragment_shader(){/*
                         
	void main(void) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}

*/}

function vertex_shader(){/*
                         
	attribute vec3 aVertexPosition;
	
	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	
	void main(void) {
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	}

*/}

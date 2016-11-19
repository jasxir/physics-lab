var gl,
    shaderProgram,
    mvMatrix = mat4.create(),
    pMatrix = mat4.create(),

    triangleVertexPositionBuffer,
    squareVertexPositionBuffer,

    triangleVertexColorBuffer,
    squareVertexColorBuffer,
    rTri = 0,
    rSquare = 0,
    lastTime = 0,
    mvMatrixStack = [];

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        //gl.enable(gl.CULL_FACE);
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function setMatrixUniforms() {
    shaderProgram.uniform.apply({
        "uPMatrix": pMatrix,
        "uMVMatrix": mvMatrix
    });
}

var leafTex;
var cubeTexBuffer;

function loadTexture() {
    initTexture(function(texture) {
        leafTex = texture;
    }, gl, "images/textures/leaf_fern_pattern-993.jpg");
}

function initBuffers() {
    cubeTexBuffer = createBuffer(gl, 2, [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);
    
    triangleVertexPositionBuffer = createBuffer(gl, 3, [
        // Front face
         0.0, 1.0, 0.0,
        -1.0, -1.0, 1.0,
         1.0, -1.0, 1.0,

        // Right face
         0.0, 1.0, 0.0,
         1.0, -1.0, 1.0,
         1.0, -1.0, -1.0,

        // Back face
         0.0, 1.0, 0.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

        // Left face
         0.0, 1.0, 0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0
    ]);

    triangleVertexColorBuffer = createBuffer(gl, 4, [
        // Front face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        // Right face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        // Back face
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        // Left face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ]);
    
    var sq = [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    
    squareVertexPositionBuffer = createBuffer(gl, 3, sq);
    
    cubeVerticesIndexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ]);

    colors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [1.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 1.0, 0.0, 1.0], // Top face
        [1.0, 0.5, 0.5, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 0.0, 1.0, 1.0]  // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }

    squareVertexColorBuffer = createBuffer(gl, 4, unpackedColors);
}

var firstTime = true;

function drawScene() {
    if (firstTime) {
        firstTime = false;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    }

    mat4.identity(mvMatrix);

    /////////////////////////////

    mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
    mvPushMatrix();
    mat4.rotate(mvMatrix, mvMatrix, Math.toRad(rTri), [0, 1, 0]);

    shaderProgram.draw({
        "uPMatrix": pMatrix,
        "uMVMatrix": mvMatrix
    }, {
        "aVertexColor" : triangleVertexColorBuffer,
        "aVertexPosition" : triangleVertexPositionBuffer
    });
    mvPopMatrix();

    /////////////////////////////

    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    mvPushMatrix();
    mat4.rotate(mvMatrix, mvMatrix, Math.toRad(rSquare), [1, 0.5, 0.2]);
    
    if(leafTex) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, leafTex);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
    }
    
    shaderProgram.draw({
        "uPMatrix": pMatrix,
        "uMVMatrix": mvMatrix,
    }, {
        "aVertexColor" : squareVertexColorBuffer,
        "aVertexPosition" : squareVertexPositionBuffer,
        "$" : cubeVerticesIndexBuffer
    });
    
    mvPopMatrix();
}

function webGLStart() {
    var canvas = document.getElementById("lesson01-canvas");
    initGL(canvas);
    shaderProgram = createProgramFromScript(gl, "#shader-vs", "#shader-fs");
    loadTexture();
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    tick();
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        rTri += (300 * elapsed) / 1000.0;
        rSquare += (75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

function tick() {
    drawScene();
    animate();
    requestAnimationFrame(tick);
}

function mvPushMatrix() {
    mvMatrixStack.push(mat4.clone(mvMatrix));
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}
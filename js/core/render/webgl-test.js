var gl,
    shaderProgram,
    mvMatrix = mat4.create(),
    pMatrix = mat4.create(),

    triangleVertexPositionBuffer,
    squareVertexPositionBuffer,

    triangleVertexColorBuffer,
    squareVertexColorBuffer;

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
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

function initBuffers() {
    triangleVertexPositionBuffer = createBuffer(3, [
         0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
    ]);
    
    triangleVertexColorBuffer = createBuffer(4, [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]);

    squareVertexPositionBuffer = createBuffer(3, [
        -1.0, 1.0, 0.0,
         1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0
    ]);

    var colors = []
    for (var i = 0; i < squareVertexPositionBuffer.numItems; i++) {
        colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    squareVertexColorBuffer = createBuffer(4, colors);
}

var createBuffer = function (itemSize, array) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = array.length / itemSize;
    return buffer;
};

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, mvMatrix, [-1.5, 0.0, -7.0]);
    shaderProgram.draw({
        "uPMatrix": pMatrix,
        "uMVMatrix": mvMatrix
    }, triangleVertexPositionBuffer, triangleVertexColorBuffer);

    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);

    shaderProgram.draw({
        "uPMatrix": pMatrix,
        "uMVMatrix": mvMatrix,
    }, squareVertexPositionBuffer, squareVertexColorBuffer);
}

function webGLStart() {
    var canvas = document.getElementById("lesson01-canvas");
    initGL(canvas);
    shaderProgram = createProgramFromScript(gl, "#shader-vs", "#shader-fs");
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawScene();
}

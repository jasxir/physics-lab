(function () {
    "use strict";
    /*global Uint16Array, Float32Array*/
    /*jslint continue:true*/
    
    var
        createShader = function (gl, type, code) {
            type = gl[type];
            var shader = gl.createShader(type),
                slValues = ["uniform", "attribute", "varying"];

            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw gl.getShaderInfoLog(shader);
            }

            shader.$data = {};
            slValues.forEach(function (valueType) {
                var list = shader.$data[valueType] = [],
                    pattern = new RegExp(valueType + " (\\w+) (\\w+);", "g"),
                    typeMatches = code.match(pattern);

                if (typeMatches) {
                    typeMatches.forEach(function (match) {
                        pattern.lastIndex = 0;
                        var matches = pattern.exec(match),
                            data = {
                                "type": matches[1],
                                "name": matches[2]
                            };
                        list.push(data);
                    });
                }
            });
            return shader;
        },

        createShaderFromScript = function (gl, selector) {
            var shaderScriptNode = document.querySelector(selector),
                type = shaderScriptNode.getAttribute("data-type"),
                code = shaderScriptNode.innerText;
            return createShader(gl, type, code);
        },

        createProgram = function (gl, args) {
            var i,
                key,
                shader,
                shaderData,
                shaderDataList,
                programValueSet,
                shaderProgram = gl.createProgram(),
                postLinkOperations = [],
                getPostLinkOp = function (key, list, map) {
                    return function () {
                        list.forEach(function (value) {
                            var name = value.name;
                            // That map (uniform, variying, attribute) already has that key.
                            if (map[name]) {
                                return;
                            }

                            switch (key) {
                            case "uniform":
                                map[name] = gl.getUniformLocation(shaderProgram, name);
                                break;

                            case "attribute":
                                map[name] = gl.getAttribLocation(shaderProgram, name);
                                break;

                            case "varying":
                                //TODO
                                //map[name] = gl.getAttribLocation(shaderProgram, name);
                                break;
                            }
                        });
                    };
                };

            for (i = 1; i < arguments.length; i += 1) {
                shader = arguments[i];
                gl.attachShader(shaderProgram, shader);
                shaderData = shader.$data;
                delete shader.$data;
                for (key in shaderData) {
                    if (shaderData.hasOwnProperty(key)) {
                        programValueSet = shaderProgram[key];
                        if (!programValueSet) {
                            shaderProgram[key] = programValueSet = {};
                        }
                        shaderDataList = shaderData[key];
                        postLinkOperations.push(getPostLinkOp(key, shaderDataList, programValueSet));
                    }
                }
            }

            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw "Unable to link program";
            }

            postLinkOperations.forEach(function (operation) {
                operation();
            });

            //TODO does this need to be here??
            gl.useProgram(shaderProgram);

            shaderProgram.uniform.apply = function (map) {
                var key,
                    uniform;

                for (key in map) {
                    if (map.hasOwnProperty(key)) {
                        uniform = shaderProgram.uniform[key];
                        if (uniform !== undefined) {
                            //TODO why 4fv?
                            gl.uniformMatrix4fv(uniform, false, map[key]);
                        }
                    }
                }
            };

            shaderProgram.attribute.apply = function (map) {
                var key,
                    attribute,
                    data,
                    buffer;

                for (key in map) {
                    if (map.hasOwnProperty(key)) {
                        buffer = map[key];
                        if (!buffer) {
                            continue;
                        }

                        if (map.hasOwnProperty(key)) {
                            attribute = shaderProgram.attribute[key];
                            gl.bindBuffer(buffer.type, buffer);

                            if (attribute !== undefined) {
                                gl.vertexAttribPointer(
                                    attribute,
                                    buffer.itemSize,
                                    gl.FLOAT,
                                    false,
                                    0,
                                    0
                                );
                            }
                        }
                    }
                }
            };

            shaderProgram.drawMode = gl.TRIANGLES;
            // POINTS, LINE_STRIP, LINE_LOOP, LINES,
            // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES

            shaderProgram.draw = function (uniformMap, attrMap) {
                shaderProgram.attribute.apply(attrMap);
                shaderProgram.uniform.apply(uniformMap);

                //TODO this is using a constant from GLSL.
                var buffer = attrMap.aVertexPosition,
                    indexBuffer = attrMap.$;

                if (indexBuffer) {
                    gl.drawElements(shaderProgram.drawMode, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

                } else {
                    gl.drawArrays(shaderProgram.drawMode, 0, buffer.numItems);
                }
            };

            for (key in shaderProgram.attribute) {
                if (shaderProgram.attribute.hasOwnProperty(key)) {
                    gl.enableVertexAttribArray(shaderProgram.attribute[key]);
                }
            }

            return shaderProgram;
        },

        createProgramFromScript = function (gl) {
            var i,
                argList = [gl];
            for (i = 1; i < arguments.length; i += 1) {
                argList.push(createShaderFromScript(gl, arguments[i]));
            }
            return createProgram.apply(null, argList);
        },

        initTexture = function (callback, gl, src) {
            var texture = gl.createTexture();
            texture.image = new Image();
            texture.image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.bindTexture(gl.TEXTURE_2D, null);
                callback(texture);
            };
            texture.image.src = src;
        },
        
        createBuffer = function (gl, itemSize, array) {
            var ArrayType,
                type,
                buffer;
    
            if (itemSize === gl.ELEMENT_ARRAY_BUFFER) {
                type = gl.ELEMENT_ARRAY_BUFFER;
                itemSize = 1;
                ArrayType = Uint16Array;

            } else {
                type = gl.ARRAY_BUFFER;
                ArrayType = Float32Array;
            }

            buffer = gl.createBuffer();
            gl.bindBuffer(type, buffer);
            gl.bufferData(type, new ArrayType(array), gl.STATIC_DRAW);

            buffer.type = type;
            buffer.itemSize = itemSize;
            buffer.numItems = array.length / itemSize;
            return buffer;
        };
    
    window.createProgramFromScript = createProgramFromScript;
    window.createBuffer = createBuffer;
    window.initTexture = initTexture;
}());

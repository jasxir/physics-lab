(function () {
    "use strict";

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

            window.x = shaderProgram;

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
                    buffer;
                
                for (key in map) {
                    buffer = map[key];
                    if (map.hasOwnProperty(key)) {
                        attribute = shaderProgram.attribute[key];
                        if (attribute !== undefined) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                            gl.vertexAttribPointer(attribute,
                                buffer.itemSize, gl.FLOAT, false, 0, 0);
                        }
                    }
                }
            };
            
            shaderProgram.drawMode = gl.TRIANGLES;
            // POINTS, LINE_STRIP, LINE_LOOP, LINES,
            // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES

            shaderProgram.draw = function (map, buffer, colorBuffer) {
                shaderProgram.attribute.apply({
                    "aVertexColor" : colorBuffer,
                    "aVertexPosition" : buffer
                });
                
                shaderProgram.uniform.apply(map);
                gl.drawArrays(shaderProgram.drawMode, 0, buffer.numItems);
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
        };

    window.createProgramFromScript = createProgramFromScript;
}());
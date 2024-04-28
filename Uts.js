
function createPerspectiveMatrix(width, height, fov, near, far) {
    var aspect = width / height;
    var f = 1.0 / Math.tan(fov / 2.0);
    var rangeInv = 1.0 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * rangeInv, -1,
        0, 0, 2 * far * near * rangeInv, 0
    ];
}
function generateCircleVertices(radius, segmentCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];

    var angleStep = (2 * Math.PI) / segmentCount;

    // Center point
    vertices.push(0, 0, 0);
    normals.push(0, 0, 1);
    texCoords.push(0.5, 0.5);

    for (var i = 0; i < segmentCount; ++i) {
        var angle = i * angleStep;

        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        var z = 0; // Circle lies in the xy-plane

        vertices.push(x, y, z);

        // Normals are along the z-axis
        normals.push(0, 0, 1);

        // Texture coordinates
        var s = 0.5 + 0.5 * Math.cos(angle); // Centering the texture
        var t = 0.5 + 0.5 * Math.sin(angle); // Centering the texture
        texCoords.push(s, t);
    }

    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords
    };
}

function generateCircleIndices(segmentCount) {
    var indices = [];

    for (var i = 1; i <= segmentCount; ++i) {
        indices.push(0, i, i % segmentCount + 1);
    }

    return indices;
}

function generateConeVertices(radius, height, sectorCount, stackCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = height / stackCount;
    var radiusStep = radius / stackCount;
 
    vertices.push(0, 0, height);
    normals.push(0, 0, 1);
    texCoords.push(0.5, 0.5);

    for (var i = 0; i <= sectorCount; ++i) {
        var sectorAngle = i * sectorStep;
        var x = radius * Math.cos(sectorAngle);
        var y = radius * Math.sin(sectorAngle);
        vertices.push(x, y, 0);
        normals.push(0, 0, -1);
        texCoords.push(0.5 + 0.5 * Math.cos(sectorAngle), 0.5 + 0.5 * Math.sin(sectorAngle));
    }
    // Generate vertices, normals, and texture coordinates for the sides of the cone
    for (var i = 1; i <= stackCount; ++i) {
        var h = i * stackStep;
        var r = radius - i * radiusStep;
        for (var j = 0; j <= sectorCount; ++j) {
            var sectorAngle = j * sectorStep;
            var x = r * Math.cos(sectorAngle);
            var y = r * Math.sin(sectorAngle);
            vertices.push(x, y, h);
            var nx = Math.cos(sectorAngle);
            var ny = Math.sin(sectorAngle);
            var nz = radius / height;
            normals.push(nx, ny, nz);
            texCoords.push(j / sectorCount, i / stackCount);
        }
    }
   
    for (var i = 1; i <= sectorCount; ++i) {
        indices.push(0, i, i + 1);
    }
    indices.push(0, sectorCount + 1, 1);

    for (var i = 0; i < stackCount - 1; ++i) {
        var k1 = i * (sectorCount + 1) + 1;
        var k2 = k1 + sectorCount + 1;
        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            indices.push(k1, k2, k1 + 1);
            indices.push(k2, k2 + 1, k1 + 1);
        }
    }
    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords,
        indices: indices
    };
}

function generateConeIndices(vertices, sectorCount, stackCount) {
    var indices = [];
    // Indices for the base of the cone
    for (var i = 1; i <= sectorCount; ++i) {
        indices.push(0, i, i + 1);
    }
    indices.push(0, sectorCount + 1, 1);
    // Indices for the sides of the cone
    for (var i = 0; i < stackCount - 1; ++i) {
        var k1 = i * (sectorCount + 1) + 1;
        var k2 = k1 + sectorCount + 1;
        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            indices.push(k1, k2, k1 + 1);
            indices.push(k2, k2 + 1, k1 + 1);
        }
    }
    return indices;
}

function generateEllipsoidVertices(radiusX, radiusY, radiusZ, sectorCount, stackCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = Math.PI / stackCount;


    for (var i = 0; i <= stackCount; ++i) {
        var stackAngle = Math.PI / 2 - i * stackStep;
        var xy = radiusX * radiusY * Math.cos(stackAngle);
        var z = radiusZ * Math.sin(stackAngle);

        for (var j = 0; j <= sectorCount; ++j) {
            var sectorAngle = j * sectorStep;

            var x = xy * Math.cos(sectorAngle);
            var y = xy * Math.sin(sectorAngle);
            vertices.push(x, y, z);
            var nx = x / radiusX;
            var ny = y / radiusY;
            var nz = z / radiusZ;
            normals.push(nx, ny, nz);

            var s = j / sectorCount;
            var t = i / stackCount;
            texCoords.push(s, t);
        }
    }
    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords,
    };
}

function generateEllipsoidIndices(vertices, sectorCount, stackCount) {
    var indices = [];

    for (var i = 0; i < stackCount; ++i) {
        var k1 = i * (sectorCount + 1);
        var k2 = k1 + sectorCount + 1;

        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            indices.push(k1, k2, k1 + 1);
            indices.push(k2, k2 + 1, k1 + 1);
        }
    }

    return indices;
}
function bezierCurve(controlPoints, numPoints) {
    var curvePoints = [];
    var n = controlPoints.length - 1;

    for (var i = 0; i <= numPoints; i++) {
        var t = i / numPoints;
        var point = { x: 0, y: 0, z: 0 };

        for (var j = 0; j <= n; j++) {
            var b = binomialCoefficient(n, j) * Math.pow(1 - t, n - j) * Math.pow(t, j);
            point.x += controlPoints[j].x * b;
            point.y += controlPoints[j].y * b;
            point.z += controlPoints[j].z * b;
        }

        curvePoints.push(point);
    }
    return curvePoints;
}

function binomialCoefficient(n, k) {
    var coeff = 1;
    for (var x = n - k + 1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}

//pakai frenet serret
function generatePipeVertices(pathPoints, radius, sectorCount) {
    var vertices = [];
    var normals = [];

    for (var i = 0; i < pathPoints.length; i++) {
        var point = pathPoints[i];
        var prevPoint = pathPoints[Math.max(0, i - 1)];
        var nextPoint = pathPoints[Math.min(pathPoints.length - 1, i + 1)];

        var tangentX, tangentY, tangentZ;

        if (prevPoint && nextPoint) {
            tangentX = (nextPoint.x - prevPoint.x);
            tangentY = (nextPoint.y - prevPoint.y);
            tangentZ = (nextPoint.z - prevPoint.z);
        } else if (nextPoint) {
            tangentX = nextPoint.x - point.x;
            tangentY = nextPoint.y - point.y;
            tangentZ = nextPoint.z - point.z;
        } else if (prevPoint) {
            tangentX = point.x - prevPoint.x;
            tangentY = point.y - prevPoint.y;
            tangentZ = point.z - prevPoint.z;
        } else {
      
            tangentX = 1; 
            tangentY = 0;
            tangentZ = 0;
        }

        var tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY + tangentZ * tangentZ);

        tangentX /= tangentLength;
        tangentY /= tangentLength;
        tangentZ /= tangentLength;

        var upX = 0, upY = 0, upZ = 1; 

        
        var normalX = tangentY * upZ - tangentZ * upY;
        var normalY = tangentZ * upX - tangentX * upZ;
        var normalZ = tangentX * upY - tangentY * upX;

        var normalLength = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);

        normalX /= normalLength;
        normalY /= normalLength;
        normalZ /= normalLength;

        var binormalX = tangentY * normalZ - tangentZ * normalY;
        var binormalY = tangentZ * normalX - tangentX * normalZ;
        var binormalZ = tangentX * normalY - tangentY * normalX;

        for (var j = 0; j <= sectorCount; j++) {
            var sectorAngle = j * (2 * Math.PI) / sectorCount;

            var cosTheta = Math.cos(sectorAngle);
            var sinTheta = Math.sin(sectorAngle);

            var x = point.x + radius * (cosTheta * normalX + sinTheta * binormalX);
            var y = point.y + radius * (cosTheta * normalY + sinTheta * binormalY);
            var z = point.z + radius * (cosTheta * normalZ + sinTheta * binormalZ);
            vertices.push(x, y, z);

            normals.push(cosTheta * normalX + sinTheta * binormalX, cosTheta * normalY + sinTheta * binormalY, cosTheta * normalZ + sinTheta * binormalZ);
        }
    }

    return {
        vertices: vertices,
        normals: normals
    };
}


function generatePipeIndices(pathPoints, sectorCount) {
    var indices = [];
    var numPoints = pathPoints.length;
    var verticesPerPoint = sectorCount + 1;

    for (var i = 0; i < numPoints - 1; i++) {
        var startIndex = i * verticesPerPoint;
        var nextStartIndex = (i + 1) * verticesPerPoint;

        for (var j = 0; j < sectorCount; j++) {
            var k1 = startIndex + j;
            var k2 = nextStartIndex + j;

            indices.push(k1, k2, k1 + 1);
            indices.push(k2, k2 + 1, k1 + 1);
        }
    }

    return indices;
}

function generateEllipticalParaboloidVertices(a, b, c, sectorCount, stackCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];

    var x, y, z, xy;
    var nx, ny, nz;
    var s, t;
    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = c / stackCount; 
    var sectorAngle, stackHeight;

    for (var i = 0; i <= stackCount; ++i) {
        stackHeight = i * stackStep; 
        xy = a * Math.sqrt(stackHeight / c);

        for (var j = 0; j <= sectorCount; ++j) {
            sectorAngle = j * sectorStep;

            x = xy * a / c * Math.cos(sectorAngle);
            z = xy * b / c * Math.sin(sectorAngle);
            y = -b * stackHeight;
            vertices.push(x, y, z);

            nx = a * a * Math.cos(sectorAngle) / Math.sqrt(stackHeight * c);
            ny = 2 * a * a * Math.sin(sectorAngle) / Math.sqrt(stackHeight * c);
            nz = -b / c;
            normals.push(nx, ny, nz);

            s = j / sectorCount;
            t = i / stackCount;
            texCoords.push(s, t);
        }
    }

    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords
    };
}

function generateEllipticalParaboloidIndices(vertices, sectorCount, stackCount) {
    var indices = [];

    for (var i = 0; i < stackCount; ++i) {
        var k1 = i * (sectorCount + 1);
        var k2 = k1 + sectorCount + 1;

        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            indices.push(k1, k2, k1 + 1);
            indices.push(k2, k2 + 1, k1 + 1);
        }
    }

    return indices;
}


function generateSphereVertices(radius, sectorCount, stackCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var colors = [];
    var x, y, z, xy;
    var nx, ny, nz, lengthInv = 1.0 / radius;
    var s, t;
    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = Math.PI / stackCount;
    var sectorAngle, stackAngle;

    for (var i = 0; i <= stackCount; ++i) {
        stackAngle = Math.PI / 2 - i * stackStep;
        xy = radius * Math.cos(stackAngle);
        z = radius * Math.sin(stackAngle);

        for (var j = 0; j <= sectorCount; ++j) {
            sectorAngle = j * sectorStep;

            x = xy * Math.cos(sectorAngle);
            y = xy * Math.sin(sectorAngle);
            vertices.push(x, y, z);

            nx = x * lengthInv;
            ny = y * lengthInv;
            nz = z * lengthInv;
            normals.push(nx, ny, nz);

            s = j / sectorCount;
            t = i / stackCount;
            texCoords.push(s, t);


        }
    }

    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords,

    };
}

function generateSphereIndices(sectorCount, stackCount) {
    var indices = [];
    var k1, k2;

    for (var i = 0; i < stackCount; ++i) {
        k1 = i * (sectorCount + 1);
        k2 = k1 + sectorCount + 1;

        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            if (i != 0) {
                indices.push(k1, k2, k1 + 1);
            }

            if (i != (stackCount - 1)) {
                indices.push(k1 + 1, k2, k2 + 1);
            }
        }
    }

    return indices;
}

function generateCylinderVertices(radius, height, sectorCount, stackCount) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var sectorStep = (2 * Math.PI) / sectorCount;
    var stackStep = height / stackCount;

    for (var i = 0; i <= stackCount; ++i) {
        var stackHeight = i * stackStep;

        for (var j = 0; j <= sectorCount; ++j) {
            var sectorAngle = j * sectorStep;

            var x = radius * Math.cos(sectorAngle);
            var y = radius * Math.sin(sectorAngle);
            var z = stackHeight;

            vertices.push(x, y, z);

           
            var nx = Math.cos(sectorAngle);
            var ny = Math.sin(sectorAngle);
            var nz = 0; 

            normals.push(nx, ny, nz);

           
            var s = j / sectorCount;
            var t = i / stackCount;

            texCoords.push(s, t);
        }
    }
    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords,
        indices: indices
    };
}

function generateCylinderIndices(vertices,sectorCount, stackCount) {
    var indices = [];
    var k1, k2;

    for (var i = 0; i < stackCount; ++i) {
        k1 = i * (sectorCount + 1);
        k2 = k1 + sectorCount + 1;

        for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
            if (i != 0) {
                indices.push(k1, k2, k1 + 1);
            }

            if (i != (stackCount - 1)) {
                indices.push(k1 + 1, k2, k2 + 1);
            }
        }
    }

    return indices;
}

function generateSquareVertices(sideLength) {
    var halfSide = sideLength / 2;
    var vertices = [
        -halfSide, -halfSide, 0,  
        halfSide, -halfSide, 0,   
        halfSide, halfSide, 0,   
        -halfSide, halfSide, 0    
    ];

    var normals = [
        0, 0, 1,  
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    var texCoords = [
        0, 0,  
        1, 0,  
        1, 1,  
        0, 1   
    ];

    return {
        vertices: vertices,
        normals: normals,
        texCoords: texCoords
    };
}

function generateSquareIndices() {

    var indices = [
        0, 1, 2,  
        0, 2, 3   
    ];

    return indices;
}

function main() {
    // Setup
    var CANVAS = document.getElementById("myCanvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    var x_prev = 0;
    var y_prev = 0;
    var drag = false;
    var dx = 0;
    var dy = 0;
    var THETA = 0;
    var ALPHA = 0;
    var FRICTION = 0.95;
    
    var MAX_ALPHA = Math.PI / 55; 
    var MIN_ALPHA = -Math.PI / 60;
    var MAX_THETA = Math.PI / 0.1;  
    var MIN_THETA = -Math.PI / 0.1; 
    
    var mouseDown = function (e) {
        drag = true;
        x_prev = e.x;
        y_prev = e.y;
        return false;
    };
    
    var mouseUp = function () {
        drag = false;
    }
    
    var mouseMove = function (e) {
        if (!drag) { return false; }
        dx = (e.x - x_prev) * 2 * Math.PI / CANVAS.width;
        dy = (e.y - y_prev) * 2 * Math.PI / CANVAS.height;
        x_prev = e.x;
        y_prev = e.y;
    
        // Update angles
        THETA += dx;
        ALPHA += dy;
    
        // Clamp angles within limits
        ALPHA = Math.max(Math.min(ALPHA, MAX_ALPHA), MIN_ALPHA);
        THETA = Math.max(Math.min(THETA, MAX_THETA), MIN_THETA);
    
        console.log(dx + " " + dy);
    }
    
    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mouseout", mouseUp, false);
    
    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert(e);
        return false;
    }

    // Shaders
    var shader_vertex_source = `
    attribute vec3 position;
    attribute vec3 color;
    uniform mat4 PMatrix;
    uniform mat4 VMatrix;
    uniform mat4 MMatrix;
    varying vec3 outColor;
    
    void main(void) {
        gl_Position = PMatrix * VMatrix * MMatrix * vec4(position, 1.0);
        outColor = color; // Pass color to fragment shader
    }
    `;

    // Modify the fragment shader to use the uniform color
    var shader_fragment_source = `
    precision mediump float;
    varying vec3 outColor;
    uniform vec3 shapeColor; // Uniform color for the shape
    
    void main(void) {
        gl_FragColor = vec4(shapeColor, 1.0); // Use uniform color
    }
    `;

    function setColorUniform(color) {
        var colorUniform = GL.getUniformLocation(SHADER_PROGRAM, "shapeColor");
        GL.uniform3fv(colorUniform, color);
    }

    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    GL.linkProgram(SHADER_PROGRAM);

    // Get attribute and uniform locations
    var position_vao = GL.getAttribLocation(SHADER_PROGRAM, "position");
    GL.enableVertexAttribArray(position_vao);

    var color_vao = GL.getAttribLocation(SHADER_PROGRAM, "color");
    GL.enableVertexAttribArray(color_vao);

    var uniform_projection_matrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix");
    var uniform_view_matrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix");
    var uniform_model_matrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix");

    GL.useProgram(SHADER_PROGRAM);


    var floor = 400;
    var sectorCount = 100;
    var stackCount = 100;
    var floorData = generateSquareVertices(floor);
    var floorvertices = floorData.vertices;
    var floornormals = floorData.normals;
    var floortexCoords = floorData.texCoords;
    var floorindices = generateSquareIndices(floorvertices,sectorCount,stackCount);

    //cat
    var radiusxhead = 6.4;
    var radiusyhead = 1.5;
    var radiuszhead = 8;
    var sectorCount = 100;
    var stackCount = 100;
    var headData = generateEllipsoidVertices(radiusxhead, radiusyhead, radiuszhead, sectorCount, stackCount);
    var headvertices = headData.vertices;
    var headnormals = headData.normals;
    var texCoords = headData.texCoords;
    var headindices = generateEllipsoidIndices(headvertices, sectorCount, stackCount);

    var radius2 = 1.7;
    var eyeData = generateSphereVertices(radius2, sectorCount, stackCount);
    var eyevertices = eyeData.vertices;
    var eyenormals = eyeData.normals;
    var eyetexCoords = eyeData.texCoords;
    var eyecolors = eyeData.colors;
    var eyeindices = generateSphereIndices(sectorCount, stackCount);

    var eyeData2 = generateSphereVertices(radius2, sectorCount, stackCount);
    var eyevertices2 = eyeData2.vertices;
    var eyenormals2 = eyeData2.normals;
    var eyetexCoords2 = eyeData2.texCoords;
    var eyecolors2 = eyeData2.colors;
    var eyeindices2 = generateSphereIndices(sectorCount, stackCount);

    var radius3 = 0.7;
    var pupilData = generateSphereVertices(radius3, sectorCount, stackCount);
    var pupilvertices = pupilData.vertices;
    var pupilnormals = pupilData.normals;
    var pupiltexCoords = pupilData.texCoords;
    var pupilcolors = pupilData.colors;
    var pupilindices = generateSphereIndices(sectorCount, stackCount);

    var pupilData2 = generateSphereVertices(radius3, sectorCount, stackCount);
    var pupilvertices2 = pupilData2.vertices;
    var pupilnormals2 = pupilData2.normals;
    var pupiltexCoords2 = pupilData2.texCoords;
    var pupilcolors2 = pupilData2.colors;
    var pupilindices2 = generateSphereIndices(sectorCount, stackCount);

    var noseData = generateSphereVertices(radius3, sectorCount, stackCount);
    var nosevertices = noseData.vertices;
    var nosenormals = noseData.normals;
    var nosetexCoords = noseData.texCoords;
    var noseindices = generateSphereIndices(sectorCount, stackCount);

    var radiusX = 3;
    var radiusY = 2;
    var height = 3;
    var earData = generateEllipticalParaboloidVertices(radiusX, radiusY, height, sectorCount, stackCount);
    var earVertices = earData.vertices;
    var earNormals = earData.normals;
    var earTexCoords = earData.texCoords;
    var earIndices = generateEllipticalParaboloidIndices(earVertices, sectorCount, stackCount);

    var earData2 = generateEllipticalParaboloidVertices(radiusX, radiusY, height, sectorCount, stackCount);
    var earVertices2 = earData2.vertices;
    var earNormals2 = earData2.normals;
    var earTexCoords2 = earData2.texCoords;
    var earIndices2 = generateEllipticalParaboloidIndices(earVertices2, sectorCount, stackCount);

    var radiusX2 = 3;
    var radiusY2 = 2;
    var height2 = 3.7;
    var innerearData = generateEllipticalParaboloidVertices(radiusX2, radiusY2, height2, sectorCount, stackCount);
    var innerearVertices = innerearData.vertices;
    var innerearNormals = innerearData.normals;
    var innerearTexCoords = innerearData.texCoords;
    var innerearIndices = generateEllipticalParaboloidIndices(innerearVertices, sectorCount, stackCount);

    var innerearData2 = generateEllipticalParaboloidVertices(radiusX2, radiusY2, height2, sectorCount, stackCount);
    var innerearVertices2 = innerearData2.vertices;
    var innerearNormals2 = innerearData2.normals;
    var innerearTexCoords2 = innerearData2.texCoords;
    var innerearIndices2 = generateEllipticalParaboloidIndices(innerearVertices2, sectorCount, stackCount);

    var radiusbody = 3.7;
    var heightbody = 7;
    var bodyData = generateCylinderVertices(radiusbody, heightbody, sectorCount, stackCount);
    var bodyVertices = bodyData.vertices;
    var bodyNormals = bodyData.normals;
    var bodyTexCoords = bodyData.texCoords;
    var bodyIndices = generateEllipticalParaboloidIndices(bodyVertices, sectorCount, stackCount);

    var radiuswhisker = 0.1;
    var heightwhisker = 6;
    var whiskerData = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices = whiskerData.vertices;
    var whiskerNormals = whiskerData.normals;
    var whiskerTexCoords = whiskerData.texCoords;
    var whiskerIndices = generateCylinderIndices(whiskerVertices, sectorCount, stackCount);

    var whiskerData2 = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices2 = whiskerData2.vertices;
    var whiskerNormals2 = whiskerData2.normals;
    var whiskerTexCoords2 = whiskerData2.texCoords;
    var whiskerIndices2 = generateCylinderIndices(whiskerVertices2, sectorCount, stackCount);

    var whiskerData3 = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices3 = whiskerData3.vertices;
    var whiskerNormals3 = whiskerData3.normals;
    var whiskerTexCoords3 = whiskerData3.texCoords;
    var whiskerIndices3 = generateCylinderIndices(whiskerVertices3, sectorCount, stackCount);

    var whiskerData4 = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices4 = whiskerData4.vertices;
    var whiskerNormals4 = whiskerData4.normals;
    var whiskerTexCoords4 = whiskerData4.texCoords;
    var whiskerIndices4 = generateCylinderIndices(whiskerVertices4, sectorCount, stackCount);

    var radiusneck = 3.8;
    var heightneck = 1;
    var neckData = generateCylinderVertices(radiusneck, heightneck, sectorCount, stackCount);
    var neckVertices = neckData.vertices;
    var neckNormals = neckData.normals;
    var neckTexCoords = neckData.texCoords;
    var neckIndices = generateEllipticalParaboloidIndices(neckVertices, sectorCount, stackCount);

    var radiusbottom = 3.7;
    var bottomData = generateSphereVertices(radiusbottom, sectorCount, stackCount);
    var bottomVertices = bottomData.vertices;
    var bottomNormals = bottomData.normals;
    var texCoords = bottomData.texCoords;
    var bottomIndices = generateSphereIndices(sectorCount, stackCount);

    var radiusxefoot = 1;
    var radiusyfoot = 0.9;
    var radiuszfoot = 3;
    var footData = generateEllipsoidVertices(radiusxefoot, radiusyfoot, radiuszfoot, sectorCount, stackCount);
    var footVertices = footData.vertices;
    var footNormals = footData.normals;
    var footTexCoords = footData.texCoords;
    var footIndices = generateEllipsoidIndices(footVertices, sectorCount, stackCount);

    var footData2 = generateEllipsoidVertices(radiusxefoot, radiusyfoot, radiuszfoot, sectorCount, stackCount);
    var footVertices2 = footData2.vertices;
    var footNormals2 = footData2.normals;
    var footTexCoords2 = footData2.texCoords;
    var footIndices2 = generateEllipsoidIndices(footVertices2, sectorCount, stackCount);

    var armData = generateEllipsoidVertices(radiusxefoot, radiusyfoot, radiuszfoot, sectorCount, stackCount);
    var armVertices = armData.vertices;
    var armNormals = armData.normals;
    var armTexCoords = armData.texCoords;
    var armIndices = generateEllipsoidIndices(armVertices, sectorCount, stackCount);

    var armData2 = generateEllipsoidVertices(radiusxefoot, radiusyfoot, radiuszfoot, sectorCount, stackCount);
    var armVertices2 = armData2.vertices;
    var armNormals2 = armData2.normals;
    var armTexCoords2 = armData2.texCoords;
    var armIndices2 = generateEllipsoidIndices(armVertices2, sectorCount, stackCount);

    //bardzmaru
    //paruh curve
    var pathPoints = [
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 5, z: 0 },
        { x: 5  , y: 0, z: 0 },


    ];
    
    var curvePointsparuh = bezierCurve(pathPoints, 100);
    // Generate pipe vertices
    var radiusparuh = 0.2;
    var paruhData = generatePipeVertices(curvePointsparuh, radiusparuh, sectorCount);
    var paruhvertices = paruhData.vertices;
    var paruhnormals = paruhData.normals;

    // Generate pipe indices
    var paruhindices = generatePipeIndices(curvePointsparuh, sectorCount);

    //head 
    var radiusxhead1 = 6;
    var radiusyhead1 = 1.3;
    var radiuszhead1 = 7;
    var sectorCount1 = 100;
    var stackCount1 = 100;
    var headData1 = generateEllipsoidVertices(radiusxhead1, radiusyhead1, radiuszhead1, sectorCount1, stackCount1);
    var headvertices1 = headData1.vertices;
    var headnormals1 = headData1.normals;
    var texCoords1 = headData1.texCoords;
    var headindices1 = generateEllipsoidIndices(headvertices1, sectorCount1, stackCount1);
    
    //rambut
    var radiusX1 = 3;
    var radiusY1 = 3;
    var height1 = 3;
    var hairData = generateEllipticalParaboloidVertices(radiusX1, radiusY1, height1, sectorCount, stackCount);
    var hairVertices = hairData.vertices;
    var hairNormals = hairData.normals;
    var hairTexCoords = hairData.texCoords;
    var hairIndices = generateEllipticalParaboloidIndices(hairVertices, sectorCount, stackCount);
    //
    var radiusX2 = 3;
    var radiusY2 = 3;
    var height2 = 3;
    var hairData2 = generateEllipticalParaboloidVertices(radiusX2, radiusY2, height2, sectorCount, stackCount);
    var hairVertices2 = hairData2.vertices;
    var hairNormals2 = hairData2.normals;
    var hairTexCoords2 = hairData2.texCoords;
    var hairIndices2 = generateEllipticalParaboloidIndices(hairVertices2, sectorCount, stackCount);
    //
    var radiusX3 = 3;
    var radiusY3 = 3;
    var height3 = 3;
    var hairData3 = generateEllipticalParaboloidVertices(radiusX3, radiusY3, height3, sectorCount, stackCount);
    var hairVertices3 = hairData3.vertices;
    var hairNormals3 = hairData3.normals;
    var hairTexCoords3 = hairData3.texCoords;
    var hairIndices3 = generateEllipticalParaboloidIndices(hairVertices3, sectorCount, stackCount);
    //
    var radiusX4 = 3;
    var radiusY4 = 3;
    var height4 = 3;
    var hairData4 = generateEllipticalParaboloidVertices(radiusX4, radiusY4, height4, sectorCount, stackCount);
    var hairVertices4 = hairData4.vertices;
    var hairNormals4 = hairData4.normals;
    var hairTexCoords = hairData4.texCoords;
    var hairIndices4 = generateEllipticalParaboloidIndices(hairVertices4, sectorCount, stackCount);

    //mata eye
    //putih kiri
    var eyeradius1 = 3.5;
    var eyeData1 = generateSphereVertices(eyeradius1, sectorCount, stackCount);
    var eyevertices1 = eyeData1.vertices;
    var eyenormals1 = eyeData1.normals;
    var eyetexCoords1 = eyeData1.texCoords;
    var eyecolors1 = eyeData1.colors;
    var eyeindices1 = generateSphereIndices(sectorCount, stackCount);
    //putih kanan
    var eyeradius3 = 3.5;
    var eyeData3 = generateSphereVertices(eyeradius3, sectorCount, stackCount);
    var eyevertices3 = eyeData3.vertices;
    var eyenormals3 = eyeData3.normals;
    var eyetexCoords3 = eyeData3.texCoords;
    var eyecolors3 = eyeData3.colors;
    var eyeindices3 = generateSphereIndices(sectorCount, stackCount);
    //bola mata kanan
    var radiusbolamata = 0.5;
    var mataData = generateSphereVertices(radiusbolamata, sectorCount, stackCount);
    var matavertices1 = mataData.vertices;
    var matanormals1 = mataData.normals;
    var matatexCoords1 = mataData.texCoords;
    var matacolors1 = mataData.colors;
    var mataindices1 = generateSphereIndices(sectorCount, stackCount);
    //bola mata kiri
    var radiusbolamata1 = 0.6;
    var mataData2 = generateSphereVertices(radiusbolamata1, sectorCount, stackCount);
    var matavertices2 = mataData2.vertices;
    var matanormals2 = mataData2.normals;
    var matatexCoords2 = mataData2.texCoords;
    var matacolors2 = mataData2.colors;
    var mataindices2 = generateSphereIndices(sectorCount, stackCount);

    //body
    var radiusX5 = 4.3;
    var radiusY5 = 4;
    var height5 = 3;
    var bodyData5 = generateEllipticalParaboloidVertices(radiusX5, radiusY5, height5, sectorCount, stackCount);
    var bodyVertices5= bodyData5.vertices;
    var bodyNormals5 = bodyData5.normals;
    var bodyTexCoords5 = bodyData5.texCoords;
    var bodyIndices5 = generateEllipticalParaboloidIndices(bodyVertices, sectorCount, stackCount);

    //tangan kanan
    //
    var radiusXtangan = 3;
    var radiusYtangan = 2;
    var heighttangan = 3.5    ;
    var tanganData = generateEllipticalParaboloidVertices(radiusXtangan, radiusYtangan, heighttangan, sectorCount, stackCount);
    var tanganVertices = tanganData.vertices;
    var tanganNormals = tanganData.normals;
    var tanganTexCoords = tanganData.texCoords;
    var tanganIndices= generateEllipticalParaboloidIndices(tanganVertices, sectorCount, stackCount);

    //tangan kiri
    var radiusXtangan1 = 3;
    var radiusYtangan1= 2;
    var heighttangan1 = 3.5;
    var tanganData1 = generateEllipticalParaboloidVertices(radiusXtangan1, radiusYtangan1, heighttangan1, sectorCount, stackCount);
    var tanganVertices1 = tanganData1.vertices;
    var tanganNormals1 = tanganData1.normals;
    var tanganTexCoords1 = tanganData1.texCoords;
    var tanganIndices1= generateEllipticalParaboloidIndices(tanganVertices1, sectorCount, stackCount);

    //perut
    var radiusperut = 4.5;
    var perutData = generateSphereVertices(radiusperut, sectorCount, stackCount);
    var perutvertices = perutData.vertices;
    var perutnormals = perutData.normals;
    var peruttexCoords = perutData.texCoords;
    var perutcolors = perutData.colors;
    var perutindices = generateSphereIndices(sectorCount, stackCount);

    //tutup bawah
    var radiustutup = 5.9;
    var tutupData = generateCircleVertices(radiustutup, sectorCount, stackCount);
    var tutupVertices = tutupData.vertices;
    var tutupNormals = tutupData.normals;
    var tutupTexCoords = tutupData.texCoords;
    var tutupIndices = generateCircleIndices(sectorCount, stackCount);

    //sphere kaki kanan
    var radiusskk=1.5;
    var skkData = generateSphereVertices(radiusskk, sectorCount, stackCount);
    var skkVertices = skkData.vertices;
    var skkNormals = skkData.normals;
    var skkTexCoords = skkData.texCoords;
    var skkColors = skkData.colors;
    var skkIndices = generateSphereIndices(sectorCount, stackCount);

    //cylinder kaki kanan
    var radiusckk= 1.5;
    var heightckk = 4;
    var ckkData = generateCylinderVertices(radiusckk, heightckk, sectorCount, stackCount);
    var ckkVertices = ckkData.vertices;
    var ckkNormals = ckkData.normals;
    var ckkTexCoords = ckkData.texCoords;
    var ckkIndices = generateCylinderIndices(ckkVertices, sectorCount, stackCount);

    //sphere kaki kiri
    var radiusskk1 = 1.5;
    var skk1Data = generateSphereVertices(radiusskk1, sectorCount, stackCount);
    var skk1Vertices = skk1Data.vertices;
    var skk1Normals = skk1Data.normals;
    var skk1TexCoords = skk1Data.texCoords;
    var skk1Colors = skk1Data.colors;
    var skk1Indices = generateSphereIndices(sectorCount, stackCount);

    //cylinder kaki kiri
    var radiusckk1 = 1.5;
    var heightckk1= 4;
    var ckk1Data = generateCylinderVertices(radiusckk1, heightckk1, sectorCount, stackCount);
    var ckk1Vertices = ckk1Data.vertices;
    var ckk1Normals = ckk1Data.normals;
    var ckk1TexCoords = ckk1Data.texCoords;
    var ckk1Indices = generateCylinderIndices(ckk1Vertices, sectorCount, stackCount);

    //nose kuning
    var radiusXnosekuning =2;
    var radiusYnosekuning = 2;
    var heightnosekuning= 2;
    var nosekuningData = generateEllipticalParaboloidVertices(radiusXnosekuning, radiusYnosekuning, heightnosekuning, sectorCount, stackCount);
    var nosekuningVertices = nosekuningData.vertices;
    var nosekuningNormals = nosekuningData.normals;
    var nosekuningTexCoords= nosekuningData.texCoords;
    var nosekuningIndices = generateEllipticalParaboloidIndices(nosekuningVertices, sectorCount, stackCount);

    // Hello Kitty

    // Head hello kitty data 
    var radiusxheadhk = 5.5;
    var radiusyheadhk = 1.5;
    var radiuszheadhk = 8;
    var sectorCount = 100;// Number of sectors (longitude)
    var stackCount = 100;// Number of stacks (latitude)
    var headhkData = generateEllipsoidVertices(radiusxheadhk,radiusyheadhk,radiuszheadhk, sectorCount, stackCount);
    var headhkvertices = headhkData.vertices;
    var headhknormals = headhkData.normals;
    var texhkCoords = headhkData.texCoords;
    var headhkindices = generateEllipsoidIndices(headhkvertices,sectorCount, stackCount);

    // Neck hk data 
    var radiusN = 2.2;
    var neckhkData = generateSphereVertices(radiusN, sectorCount, stackCount);
    var neckhkvertices = neckhkData.vertices;
    var neckhknormals = neckhkData.normals;
    var neckhktexCoords = neckhkData.texCoords;
    var neckhkcolors = neckhkData.colors;
    var neckhkindices = generateSphereIndices(sectorCount, stackCount);
    
    // Eye data hk
    var radius2 = 0.8;
    var eyeDatahk = generateSphereVertices(radius2, sectorCount, stackCount);
    var eyeverticeshk = eyeDatahk.vertices;
    var eyenormalshk = eyeDatahk.normals;
    var eyetexCoordshk = eyeDatahk.texCoords;
    var eyecolorshk = eyeDatahk.colors;
    var eyeindiceshk = generateSphereIndices(sectorCount, stackCount);

    var eyeData2hk = generateSphereVertices(radius2, sectorCount, stackCount);
    var eyevertices2hk = eyeData2hk.vertices;
    var eyenormals2hk = eyeData2hk.normals;
    var eyetexCoords2hk = eyeData2hk.texCoords;
    var eyecolors2hk = eyeData2hk.colors;
    var eyeindices2hk = generateSphereIndices(sectorCount, stackCount);

    // Acc(tengahnya)
    var radiusBesar = 1
    var accData = generateSphereVertices(radiusBesar, sectorCount, stackCount);
    var accvertices = accData.vertices;
    var accnormals = accData.normals;
    var acctexCoords = accData.texCoords;
    var acccolors = accData.colors;
    var accindices = generateSphereIndices(sectorCount, stackCount);

    // Acc rear2(kanan)
    var radiuskecil = 0.5
    var accData2 = generateSphereVertices(radiuskecil, sectorCount, stackCount);
    var accvertices2 = accData2.vertices;
    var accnormals2 = accData2.normals;
    var acctexCoords2 = accData2.texCoords;
    var acccolors2 = accData2.colors;
    var accindices2 = generateSphereIndices(sectorCount, stackCount);

    // Acc rear3(kiri)
    var accData3 = generateSphereVertices(radiuskecil, sectorCount, stackCount);
    var accvertices3 = accData3.vertices;
    var accnormals3 = accData3.normals;
    var acctexCoords3 = accData3.texCoords;
    var acccolors3 = accData3.colors;
    var accindices3 = generateSphereIndices(sectorCount, stackCount);

    // Button data 
    var radiusB = 0.5
    var buttonData = generateSphereVertices(radiusB, sectorCount, stackCount);
    var buttonvertices = buttonData.vertices;
    var buttonnormals = buttonData.normals;
    var buttontexCoords = buttonData.texCoords;
    var buttoncolors = buttonData.colors;
    var buttonindices = generateSphereIndices(sectorCount, stackCount);

    // Button2 data 
    var buttonData2 = generateSphereVertices(radiusB, sectorCount, stackCount);
    var buttonvertices2 = buttonData2.vertices;
    var buttonnormals2 = buttonData2.normals;
    var buttontexCoords2 = buttonData2.texCoords;
    var buttoncolors2 = buttonData2.colors;
    var buttonindices2 = generateSphereIndices(sectorCount, stackCount);

    // Nose hk data 
    var radius3 = 0.8;
    var noseDatahk = generateSphereVertices(radius3, sectorCount, stackCount);
    var noseverticeshk = noseDatahk.vertices;
    var nosenormalshk = noseDatahk.normals;
    var nosetexCoordshk = noseDatahk.texCoords;
    var noseindiceshk = generateSphereIndices(sectorCount, stackCount);

    // Ear data hk
    var radiusX = 3;
    var radiusY = 2;
    var height = 3;
    var earDatahk = generateEllipticalParaboloidVertices(radiusX, radiusY, height, sectorCount, stackCount);
    var earVerticeshk = earDatahk.vertices;
    var earNormalshk = earDatahk.normals;
    var earTexCoordshk = earDatahk.texCoords;
    var earIndiceshk = generateEllipticalParaboloidIndices(earVerticeshk, sectorCount, stackCount);

    var earData2hk = generateEllipticalParaboloidVertices(radiusX, radiusY, height, sectorCount, stackCount);
    var earVertices2hk = earData2hk.vertices;
    var earNormals2hk = earData2hk.normals;
    var earTexCoords2hk = earData2hk.texCoords;
    var earIndices2hk = generateEllipticalParaboloidIndices(earVertices2hk, sectorCount, stackCount);

    // Body data cone
    var radius = 5; // Set the radius of the cone
    var height = 10; // Set the height of the cone
    
    var coneData = generateConeVertices(radius, height, sectorCount, stackCount);
    var conevertices = coneData.vertices;
    var conenormals = coneData.normals;
    var conetexCoords = coneData.texCoords;
    var coneindices = generateConeIndices(conevertices, sectorCount, stackCount);

    // Whisker data hello kitty
    var radiuswhisker = 0.1;
    var heightwhisker = 4;
    var whiskerDatahk = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVerticeshk = whiskerDatahk.vertices;
    var whiskerNormalshk = whiskerDatahk.normals;
    var whiskerTexCoordshk = whiskerDatahk.texCoords;
    var whiskerIndiceshk = generateEllipticalParaboloidIndices(whiskerVerticeshk, sectorCount, stackCount);

    var whiskerData2hk = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices2hk = whiskerData2hk.vertices;
    var whiskerNormals2hk = whiskerData2hk.normals;
    var whiskerTexCoords2hk = whiskerData2hk.texCoords;
    var whiskerIndices2hk = generateEllipticalParaboloidIndices(whiskerVertices2hk, sectorCount, stackCount);

    var whiskerData3hk = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices3hk= whiskerData3hk.vertices;
    var whiskerNormals3hk = whiskerData3hk.normals;
    var whiskerTexCoords3hk = whiskerData3hk.texCoords;
    var whiskerIndices3hk = generateEllipticalParaboloidIndices(whiskerVertices3hk, sectorCount, stackCount);

    var whiskerData4hk = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices4hk = whiskerData4hk.vertices;
    var whiskerNormals4hk = whiskerData4hk.normals;
    var whiskerTexCoords4hk = whiskerData4hk.texCoords;
    var whiskerIndices4hk = generateEllipticalParaboloidIndices(whiskerVertices4hk, sectorCount, stackCount);

    var whiskerData5 = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices5 = whiskerData5.vertices;
    var whiskerNormals5 = whiskerData5.normals;
    var whiskerTexCoords5 = whiskerData5.texCoords;
    var whiskerIndices5 = generateEllipticalParaboloidIndices(whiskerVertices5, sectorCount, stackCount);

    var whiskerData6 = generateCylinderVertices(radiuswhisker, heightwhisker, sectorCount, stackCount);
    var whiskerVertices6 = whiskerData6.vertices;
    var whiskerNormals6 = whiskerData6.normals;
    var whiskerTexCoords6 = whiskerData6.texCoords;
    var whiskerIndices6 = generateEllipticalParaboloidIndices(whiskerVertices6, sectorCount, stackCount);

    // Foot data hk
    var radiusF = 2;
    var footDatahk = generateSphereVertices(radiusF, sectorCount, stackCount);
    var footverticeshk = footDatahk.vertices;
    var footnormalshk = footDatahk.normals;
    var foottexCoordshk = footDatahk.texCoords;
    var footcolorshk = footDatahk.colors;
    var footindiceshk = generateSphereIndices(sectorCount, stackCount);
 
    var footData2hk = generateSphereVertices(radiusF, sectorCount, stackCount);
    var footvertices2hk = footData2hk.vertices;
    var footnormals2hk = footData2hk.normals;
    var foottexCoords2hk = footData2hk.texCoords;
    var footcolors2hk = footData2hk.colors;
    var footindices2hk = generateSphereIndices(sectorCount, stackCount);

    // Arm data 
    var radiusxearmhk = 1;
    var radiusyarmhk = 0.9;
    var radiuszarmhk = 3;
    var armDatahk = generateEllipsoidVertices(radiusxearmhk, radiusyarmhk, radiuszarmhk, sectorCount, stackCount);
    var armVerticeshk = armDatahk.vertices;
    var armNormalshk = armDatahk.normals;
    var armTexCoordshk = armDatahk.texCoords;
    var armIndiceshk = generateEllipsoidIndices(armVerticeshk, sectorCount, stackCount);

    var armData2hk = generateEllipsoidVertices(radiusxearmhk, radiusyarmhk, radiuszarmhk, sectorCount, stackCount);
    var armVertices2hk = armData2hk.vertices;
    var armNormals2hk = armData2hk.normals;
    var armTexCoords2hk = armData2hk.texCoords;
    var armIndices2hk = generateEllipsoidIndices(armVertices2hk, sectorCount, stackCount);

    var pathPointsR = [
        { x: 0, y: 0, z: 0 },
        { x: 2, y: 2, z: -2 },
        { x: 2, y: 0, z: -2 },
        { x: 0, y: 0, z: 0 }
    ];
    
    //Curve datakanan
    var curvePointsR = bezierCurve(pathPointsR, 100);
    var radiusCurveR = 0.1;
    var crvData = generatePipeVertices(curvePointsR, radiusCurveR, sectorCount);
    var crvvertices = crvData.vertices;
    var crvnormals = crvData.normals;
    var crvindices = generatePipeIndices(curvePointsR, sectorCount);

    //Curve datakiri
    var curvePoints2R = bezierCurve(pathPoints, 100);
    var crvData2 = generatePipeVertices(curvePoints2R, radiusCurveR, sectorCount);
    var crvvertices2 = crvData2.vertices;
    var crvnormals2 = crvData2.normals;
    var crvindices2 = generatePipeIndices(curvePoints2R, sectorCount);

    // cls
    var radiusClosing = 5;
    var clsData = generateCircleVertices(radiusClosing, sectorCount, stackCount);
    var clsVertices = clsData.vertices;
    var clsNormals = clsData.normals;
    var clsTexCoords = clsData.texCoords;
    var clsindices = generateCircleIndices(sectorCount, stackCount);


   
    //environtment
    var radiusstem = 6;
    var heightstem = 50;
    var stemData = generateCylinderVertices(radiusstem,  heightstem, sectorCount, stackCount);
    var stemVertices = stemData.vertices;
    var stemNormals = stemData.normals;
    var stemTexCoords = stemData.texCoords;
    var stemIndices = generateCylinderIndices(whiskerVertices4, sectorCount, stackCount);

    var radiusleaf = 20;
    var leafData = generateSphereVertices(radiusleaf, sectorCount, stackCount);
    var leafvertices = leafData.vertices;
    var leafnormals = leafData.normals;
    var leaftexCoords = leafData.texCoords;
    var leafindices = generateSphereIndices(sectorCount, stackCount);

    var leafData2 = generateSphereVertices(radiusleaf, sectorCount, stackCount);
    var leafvertices2 = leafData2.vertices;
    var leafnormals2 = leafData2.normals;
    var leaftexCoords2 = leafData2.texCoords;
    var leafindices2 = generateSphereIndices(sectorCount, stackCount);

    var leafData3 = generateSphereVertices(radiusleaf, sectorCount, stackCount);
    var leafvertices3 = leafData3.vertices;
    var leafnormals3 = leafData3.normals;
    var leaftexCoords3 = leafData3.texCoords;
    var leafindices3 = generateSphereIndices(sectorCount, stackCount);

    var tentradius = 30; // Set the radius of the cone
    var tentheight = 60; // Set the height of the cone
    var tentData = generateConeVertices(tentradius, tentheight, sectorCount, stackCount);
    var tentvertices = tentData.vertices;
    var tentnormals = tentData.normals;
    var tenttexCoords = tentData.texCoords;
    var tentindices = generateConeIndices(tentvertices, sectorCount, stackCount);

    var doorradiusX = 20;
    var doorradiusY = 10;
    var doorheight = 20;
    var doorData = generateEllipticalParaboloidVertices(doorradiusX, doorradiusY, doorheight, sectorCount, stackCount);
    var doorVertices = doorData.vertices;
    var doorNormals = doorData.normals;
    var doorTexCoords = doorData.texCoords;
    var doorIndices = generateEllipticalParaboloidIndices(doorVertices, sectorCount, stackCount);
    var pathPoints = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 1, z: -1 },
        { x: 0, y: 4, z: -6 },
        { x: 2, y: 4, z: -7 },
        { x: 3, y: 4, z: -8 },
        { x: 4, y: 4, z: -10 },
        { x: 5, y: 4, z: -15 },
        { x: 10, y: 4, z: -15 },
        { x: 11, y: 4, z: -14.9 },
        { x: 12, y: 4, z: -14.9 },
        { x: 13, y: 4, z: -2 },
    ];
    var curvePoints = bezierCurve(pathPoints, 160);
    // Generate pipe vertices
    var radiustail = 0.9;
    var tailData = generatePipeVertices(curvePoints, radiustail, sectorCount);
    var tailvertices = tailData.vertices;
    var tailnormals = tailData.normals;

    // Generate pipe indices
    var tailindices = generatePipeIndices(curvePoints, sectorCount);

     //bind buffer badzmaru
    // head
    var headvertex_vbo1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headvertex_vbo1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headvertices1), GL.STATIC_DRAW);

    var headnormal_vbo1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headnormal_vbo1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headnormals1), GL.STATIC_DRAW);

    var headindex_ebo1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headindex_ebo1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(headindices1), GL.STATIC_DRAW);

    var projection_matrix = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var view_matrix = LIBS.get_I4();
    var model_matrix = LIBS.get_I4();  
    
    //hair
    var hairVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairVertices), GL.STATIC_DRAW);

    var hairNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairNormals), GL.STATIC_DRAW);


    var hairIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hairIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO);
    //

    var hairVertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairVertices2), GL.STATIC_DRAW);

    var hairNormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairNormals2), GL.STATIC_DRAW);


    var hairIndexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hairIndices2), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO2);
    //

    var hairVertexVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairVertices3), GL.STATIC_DRAW);

    var hairNormalVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairNormals3), GL.STATIC_DRAW);


    var hairIndexEBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hairIndices3), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO3);
    //
    var hairVertexVBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairVertices4), GL.STATIC_DRAW);

    var hairNormalVBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(hairNormals4), GL.STATIC_DRAW);


    var hairIndexEBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO4);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(hairIndices4), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO4);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO4);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO4);

    // mata eye 
    //putih kiri
    var eyevertexVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyevertices1), GL.STATIC_DRAW);

    var eyenormalVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormals1), GL.STATIC_DRAW);

    var eyetexCoordVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoords1), GL.STATIC_DRAW);

    var eyeindexEBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindices1), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO1);
    //puith kanan
    var eyevertexVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyevertices3), GL.STATIC_DRAW);

    var eyenormalVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormals3), GL.STATIC_DRAW);

    var eyetexCoordVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoords3), GL.STATIC_DRAW);

    var eyeindexEBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindices3), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2);

    //bola mata kanan
    var matavertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matavertices1), GL.STATIC_DRAW);

    var matanormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matanormals1), GL.STATIC_DRAW);

    var matatexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matatexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matatexCoords1), GL.STATIC_DRAW);

    var mataindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mataindices1), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO);

    //bola mata kiri
    var matavertexVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matavertices2), GL.STATIC_DRAW);

    var matanormalVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matanormals2), GL.STATIC_DRAW);

    var matatexCoordVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, matatexCoordVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(matatexCoords2), GL.STATIC_DRAW);

    var mataindexEBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(mataindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO);

    //badan
    var bodyVertexVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bodyVertices5), GL.STATIC_DRAW);

    var bodyNormalVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bodyNormals5), GL.STATIC_DRAW);


    var bodyIndexEBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(bodyIndices5), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO1);


    //tangan kanan
    var tanganVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanganVertices), GL.STATIC_DRAW);

    var tanganNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanganNormals), GL.STATIC_DRAW);


    var tanganIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tanganIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO);

    //tangan kiri
    var tanganVertexVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanganVertices1), GL.STATIC_DRAW);

    var tanganNormalVBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO1);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tanganNormals1), GL.STATIC_DRAW);


    var tanganIndexEBO1 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO1);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tanganIndices1), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO1);

    //perut
    var perutvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, perutvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(perutvertices), GL.STATIC_DRAW);

    var perutnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, perutnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(perutnormals), GL.STATIC_DRAW);

    var peruttexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, peruttexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(peruttexCoords), GL.STATIC_DRAW);

    var perutindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, perutindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(perutindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER,perutvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, perutnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, perutindexEBO);


    //tutup bawah
    var tutupVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tutupVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tutupVertices), GL.STATIC_DRAW);

    var tutupNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tutupNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tutupNormals), GL.STATIC_DRAW);


    var tutupIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tutupIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tutupIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER,tutupVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tutupNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tutupIndexEBO);

    //sphere kaki kiri
    var skk1VertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER,skk1VertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(skk1Vertices), GL.STATIC_DRAW);

    var skk1NormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, skk1NormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(skk1Normals), GL.STATIC_DRAW);


    var skk1IndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skk1IndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(skk1Indices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, skk1VertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, skk1NormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skk1IndexEBO);

    //sphere kaki kanan
    var skkVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER,skkVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(skkVertices), GL.STATIC_DRAW);

    var skkNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, skkNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(skkNormals), GL.STATIC_DRAW);


    var skkIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skkIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(skkIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, skkVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, skkNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skkIndexEBO);


    //cylinder kaki kiri
    var ckk1VertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1VertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ckk1Vertices), GL.STATIC_DRAW);

    var ckk1NormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1NormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ckk1Normals), GL.STATIC_DRAW);


    var ckk1IndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckk1IndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ckk1Indices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1VertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1NormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckk1IndexEBO);
    
    //cylinder kaki kanan
    var ckkVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ckkVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ckkVertices), GL.STATIC_DRAW);

    var ckkNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ckkNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ckkNormals), GL.STATIC_DRAW);


    var ckkIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckkIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ckkIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, ckkVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ckkNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckkIndexEBO);

    //nose kuning
    var nosekuningVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER,nosekuningVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosekuningVertices), GL.STATIC_DRAW);

    var nosekuningNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosekuningNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosekuningNormals), GL.STATIC_DRAW);


    var nosekuningIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, nosekuningIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(nosekuningIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, nosekuningVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, nosekuningNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, nosekuningIndexEBO);

    //paruh curver
    var paruhvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, paruhvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(paruhvertices), GL.STATIC_DRAW);

    var paruhnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, paruhnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(paruhnormals), GL.STATIC_DRAW);



    var paruhindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, paruhindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(paruhindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, paruhvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, paruhnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, paruhindexEBO);



    //ear 2
    var earVertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earVertices2), GL.STATIC_DRAW);

    var earNormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earNormals2), GL.STATIC_DRAW);


    var earIndexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(earIndices2), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2);

    // ear
    var earVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earVertices), GL.STATIC_DRAW);

    var earNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earNormals), GL.STATIC_DRAW);


    var earIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(earIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO);

    // eye

    var eyevertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyevertices), GL.STATIC_DRAW);

    var eyenormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormals), GL.STATIC_DRAW);

    var eyetexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoords), GL.STATIC_DRAW);

    var eyeindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO);

    // eye2
    var eyevertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyevertices2), GL.STATIC_DRAW);

    var eyenormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormals2), GL.STATIC_DRAW);

    var eyetexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoords2), GL.STATIC_DRAW);

    var eyeindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2);

    //pupil

    var pupilvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilvertices), GL.STATIC_DRAW);

    var pupilnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilnormals), GL.STATIC_DRAW);

    var pupiltexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupiltexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupiltexCoords), GL.STATIC_DRAW);

    var pupilindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, pupilindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pupilindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, pupilindexEBO);

    //pupil2

    var pupilvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilvertices2), GL.STATIC_DRAW);

    var pupilnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupilnormals2), GL.STATIC_DRAW);

    var pupiltexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, pupiltexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(pupiltexCoords2), GL.STATIC_DRAW);

    var pupilindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, pupilindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(pupilindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //nose
    var nosevertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosevertices), GL.STATIC_DRAW);

    var nosenormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosenormals), GL.STATIC_DRAW);

    var nosetexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosetexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosetexCoords), GL.STATIC_DRAW);

    var noseindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(noseindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBO);

    // head
    var headvertex_vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headvertex_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headvertices), GL.STATIC_DRAW);

    var headnormal_vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headnormal_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headnormals), GL.STATIC_DRAW);

    var headindex_ebo = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headindex_ebo);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(headindices), GL.STATIC_DRAW);

    // Example usage:
var canvasWidth = CANVAS.width; // Set canvas width (replace with actual value)
var canvasHeight = CANVAS.height; // Set canvas height (replace with actual value)
var near = 0.1;  // Near clipping plane distance
var far = 10000.0;  // Far clipping plane distance
var fov = Math.PI / 4; // 45-degree field of view (can adjust as needed)

var projection_matrix = createPerspectiveMatrix(canvasWidth, canvasHeight, fov, near, far);

    var view_matrix = LIBS.get_I4();
    var model_matrix = LIBS.get_I4();


    // inner ear
    var innerearVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(innerearVertices), GL.STATIC_DRAW);

    var innerearNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(innerearNormals), GL.STATIC_DRAW);


    var innerearIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(innerearIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO);

    // inner ear2
    var innerearVertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(innerearVertices2), GL.STATIC_DRAW);

    var innerearNormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(innerearNormals2), GL.STATIC_DRAW);


    var innerearIndexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(innerearIndices2), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO2);


    // body
    var bodyVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bodyVertices), GL.STATIC_DRAW);

    var bodyNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bodyNormals), GL.STATIC_DRAW);


    var bodyIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(bodyIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO);

    // neck
    var neckVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, neckVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(neckVertices), GL.STATIC_DRAW);

    var neckNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, neckNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(neckNormals), GL.STATIC_DRAW);


    var neckIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(neckIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, neckVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, neckNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckIndexEBO);

    // bottom
    var bottomVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bottomVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bottomVertices), GL.STATIC_DRAW);

    var bottomNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, bottomNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(bottomNormals), GL.STATIC_DRAW);


    var bottomIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(bottomIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, bottomVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, bottomNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomIndexEBO);

    //tail

    var tailvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tailvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailvertices), GL.STATIC_DRAW);

    var tailnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tailnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tailnormals), GL.STATIC_DRAW);



    var tailindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tailindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tailindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, tailvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tailnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tailindexEBO);


    // whisker

    var whiskervertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices), GL.STATIC_DRAW);

    var whiskernormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals), GL.STATIC_DRAW);

    var whiskertexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords), GL.STATIC_DRAW);

    var whiskerindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO);


    // whisker2

    var whiskervertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices2), GL.STATIC_DRAW);

    var whiskernormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals2), GL.STATIC_DRAW);

    var whiskertexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords2), GL.STATIC_DRAW);

    var whiskerindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2);


    // whisker 3

    var whiskervertexVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices3), GL.STATIC_DRAW);

    var whiskernormalVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals3), GL.STATIC_DRAW);

    var whiskertexCoordVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords3), GL.STATIC_DRAW);

    var whiskerindexEBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices3), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3);


    // whisker 4

    var whiskervertexVBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices4), GL.STATIC_DRAW);

    var whiskernormalVBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals4), GL.STATIC_DRAW);

    var whiskertexCoordVBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO4);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords4), GL.STATIC_DRAW);

    var whiskerindexEBO4 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices4), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4);

    //foot
    var footvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footVertices), GL.STATIC_DRAW);

    var footnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footNormals), GL.STATIC_DRAW);

    var foottexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, foottexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footTexCoords), GL.STATIC_DRAW);

    var footindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(footIndices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //foot2
    var footvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footVertices2), GL.STATIC_DRAW);

    var footnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footNormals2), GL.STATIC_DRAW);

    var foottexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, foottexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footTexCoords2), GL.STATIC_DRAW);

    var footindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(footIndices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    //arm
    var armvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armVertices), GL.STATIC_DRAW);

    var armnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armNormals), GL.STATIC_DRAW);

    var armtexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armtexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armTexCoords), GL.STATIC_DRAW);

    var armindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(armIndices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //arm2
    var armvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armVertices2), GL.STATIC_DRAW);

    var armnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armNormals2), GL.STATIC_DRAW);

    var armtexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armtexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armTexCoords2), GL.STATIC_DRAW);

    var armindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(armIndices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //floor
    var floorvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, floorvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(floorvertices), GL.STATIC_DRAW);

    var floornormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, floornormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(floornormals), GL.STATIC_DRAW);

    var floortexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, floortexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(floortexCoords), GL.STATIC_DRAW);

    var floorindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, floorindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(floorindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, floorvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, floornormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    //stem
    var stemvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, stemvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(stemVertices), GL.STATIC_DRAW);

    var stemnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, stemnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(stemNormals), GL.STATIC_DRAW);

    var stemtexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, stemtexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(stemTexCoords), GL.STATIC_DRAW);

    var stemindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, stemindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(stemIndices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, stemvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, stemnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, stemindexEBO);

    //leaf
    var leafvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafvertices), GL.STATIC_DRAW);

    var leafnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafnormals), GL.STATIC_DRAW);

    var leaftexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leaftexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leaftexCoords), GL.STATIC_DRAW);

    var leafindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leafindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //leaf2
     var leafvertexVBO2 = GL.createBuffer();
     GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO2);
     GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafvertices2), GL.STATIC_DRAW);
 
     var leafnormalVBO2 = GL.createBuffer();
     GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO2);
     GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafnormals2), GL.STATIC_DRAW);
 
     var leaftexCoordVBO2 = GL.createBuffer();
     GL.bindBuffer(GL.ARRAY_BUFFER, leaftexCoordVBO2);
     GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leaftexCoords2), GL.STATIC_DRAW);
 
     var leafindexEBO2 = GL.createBuffer();
     GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO2);
     GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leafindices2), GL.STATIC_DRAW);
 
     GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO2);
     GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
 
     GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO2);
     GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //leaf3
    var leafvertexVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafvertices3), GL.STATIC_DRAW);

    var leafnormalVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leafnormals3), GL.STATIC_DRAW);

    var leaftexCoordVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, leaftexCoordVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(leaftexCoords3), GL.STATIC_DRAW);

    var leafindexEBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(leafindices3), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
 

    //tent
    var tentvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tentvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tentvertices), GL.STATIC_DRAW);

    var tentnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tentnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tentnormals), GL.STATIC_DRAW);

    var tenttexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, tenttexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tenttexCoords), GL.STATIC_DRAW);

    var tentindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tentindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tentindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, tentvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tentnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    
    // door
    var doorVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, doorVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(doorVertices), GL.STATIC_DRAW);

    var doorNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, doorNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(doorNormals), GL.STATIC_DRAW);


    var doorIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, doorIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(doorIndices), GL.STATIC_DRAW);


    GL.bindBuffer(GL.ARRAY_BUFFER, doorVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, doorNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, doorIndexEBO);

    // bind buffer hello kitty
    // head hk
    var headhkvertex_vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headhkvertex_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headhkvertices), GL.STATIC_DRAW);

    var headhknormal_vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, headhknormal_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(headhknormals), GL.STATIC_DRAW);

    var headhkindex_ebo = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headhkindex_ebo);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(headhkindices), GL.STATIC_DRAW);

    // Neck hk
    var neckvertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, neckvertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(neckhkvertices), GL.STATIC_DRAW);
 
    var necknormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, necknormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(neckhknormals), GL.STATIC_DRAW);
 
    var necktexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, necktexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(neckhktexCoords), GL.STATIC_DRAW);
 
    var neckindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(neckhkindices), GL.STATIC_DRAW);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, neckvertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, necknormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckindexEBOhk);

    // eye
    var eyevertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyeverticeshk), GL.STATIC_DRAW);

    var eyenormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormalshk), GL.STATIC_DRAW);

    var eyetexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoordshk), GL.STATIC_DRAW);

    var eyeindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindiceshk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBOhk);

    // eye2
    var eyevertexVBO2hk2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2hk2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyevertices2hk), GL.STATIC_DRAW);

    var eyenormalVBO2hk2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2hk2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyenormals2hk), GL.STATIC_DRAW);

    var eyetexCoordVBO2hk2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, eyetexCoordVBO2hk2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(eyetexCoords2), GL.STATIC_DRAW);

    var eyeindexEBO2hk2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2hk2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(eyeindices2hk), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2hk2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2hk2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2hk2);

    // Acc
    var accvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accvertices), GL.STATIC_DRAW);

    var accnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accnormals), GL.STATIC_DRAW);

    var acctexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, acctexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(acctexCoords), GL.STATIC_DRAW);

    var accindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(accindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO);

    // Acc 2
    var accvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accvertices2), GL.STATIC_DRAW);

    var accnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accnormals2), GL.STATIC_DRAW);

    var acctexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, acctexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(acctexCoords2), GL.STATIC_DRAW);

    var accindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(accindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO2);

    // Acc 3
    var accvertexVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accvertices3), GL.STATIC_DRAW);

    var accnormalVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(accnormals3), GL.STATIC_DRAW);

    var acctexCoordVBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, acctexCoordVBO3);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(acctexCoords3), GL.STATIC_DRAW);

    var accindexEBO3 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO3);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(accindices3), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO3);

    // Button
    var buttonvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttonvertices), GL.STATIC_DRAW);

    var buttonnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttonnormals), GL.STATIC_DRAW);

    var buttontexCoordVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttontexCoordVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttontexCoords), GL.STATIC_DRAW);

    var buttonindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(buttonindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO);

    // Button 2
    var buttonvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttonvertices2), GL.STATIC_DRAW);

    var buttonnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttonnormals2), GL.STATIC_DRAW);

    var buttontexCoordVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buttontexCoordVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(buttontexCoords2), GL.STATIC_DRAW);

    var buttonindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(buttonindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO2);

    //nose hk
    var nosevertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(noseverticeshk), GL.STATIC_DRAW);

    var nosenormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosenormalshk), GL.STATIC_DRAW);

    var nosetexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, nosetexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(nosetexCoordshk), GL.STATIC_DRAW);

    var noseindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(noseindiceshk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBOhk);

    // ear
    var earVertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earVerticeshk), GL.STATIC_DRAW);

    var earNormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earNormalshk), GL.STATIC_DRAW);

    var earIndexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(earIndiceshk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBOhk);

    //ear 2
    var earVertexVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earVertices2hk), GL.STATIC_DRAW);

    var earNormalVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(earNormals2hk), GL.STATIC_DRAW);

    var earIndexEBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(earIndices2hk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2hk);

    // Cone (body)
    var coneVertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, coneVertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(conevertices), GL.STATIC_DRAW);

    var coneNormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, coneNormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(conenormals), GL.STATIC_DRAW);

    var coneIndexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, coneIndexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(coneindices), GL.STATIC_DRAW);

    // whisker hk
    var whiskervertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVerticeshk), GL.STATIC_DRAW);

    var whiskernormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormalshk), GL.STATIC_DRAW);

    var whiskertexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoordshk), GL.STATIC_DRAW);

    var whiskerindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndiceshk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBOhk);

    // whisker2
    var whiskervertexVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices2hk), GL.STATIC_DRAW);

    var whiskernormalVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals2hk), GL.STATIC_DRAW);

    var whiskertexCoordVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords2hk), GL.STATIC_DRAW);

    var whiskerindexEBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices2hk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2hk);

    // whisker 3
    var whiskervertexVBO3hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices3hk), GL.STATIC_DRAW);

    var whiskernormalVBO3hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals3hk), GL.STATIC_DRAW);

    var whiskertexCoordVBO3hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO3hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords3hk), GL.STATIC_DRAW);

    var whiskerindexEBO3hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices3hk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3hk);

    // whisker 4
    var whiskervertexVBO4hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices4hk), GL.STATIC_DRAW);

    var whiskernormalVBO4hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals4hk), GL.STATIC_DRAW);

    var whiskertexCoordVBO4hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO4hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords4hk), GL.STATIC_DRAW);

    var whiskerindexEBO4hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices4hk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4hk);

    // whisker 5
    var whiskervertexVBO5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices5), GL.STATIC_DRAW);

    var whiskernormalVBO5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals5), GL.STATIC_DRAW);

    var whiskertexCoordVBO5 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO5);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords5), GL.STATIC_DRAW);

    var whiskerindexEBO5 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO5);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices5), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO5);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO5);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    // whisker 6
    var whiskervertexVBO6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerVertices6), GL.STATIC_DRAW);

    var whiskernormalVBO6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerNormals6), GL.STATIC_DRAW);

    var whiskertexCoordVBO6 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, whiskertexCoordVBO6);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(whiskerTexCoords6), GL.STATIC_DRAW);

    var whiskerindexEBO6 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO6);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(whiskerIndices6), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO6);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO6);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4hk);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4hk);

    // Foot
    var footvertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footverticeshk), GL.STATIC_DRAW);
 
    var footnormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footnormalshk), GL.STATIC_DRAW);
 
    var foottexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, foottexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(foottexCoordshk), GL.STATIC_DRAW);
 
    var footindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(footindiceshk), GL.STATIC_DRAW);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBOhk);

    // //foot2
    var footvertexVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footvertices2hk), GL.STATIC_DRAW);

    var footnormalVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(footnormals2hk), GL.STATIC_DRAW);

    var foottexCoordVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, foottexCoordVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(foottexCoords2hk), GL.STATIC_DRAW);

    var footindexEBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO2hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(footindices2hk), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //arm
    var armvertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armVerticeshk), GL.STATIC_DRAW);
 
    var armnormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armNormalshk), GL.STATIC_DRAW);
 
    var armtexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armtexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armTexCoordshk), GL.STATIC_DRAW);
 
    var armindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(armIndiceshk), GL.STATIC_DRAW);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
 
    //arm2
    var armvertexVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armVertices2hk), GL.STATIC_DRAW);
 
    var armnormalVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armNormals2hk), GL.STATIC_DRAW);
 
    var armtexCoordVBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, armtexCoordVBO2hk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(armTexCoords2hk), GL.STATIC_DRAW);
 
    var armindexEBO2hk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO2hk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(armIndices2hk), GL.STATIC_DRAW);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2hk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
 
    GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2hk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //curve kanan
    var crvvertexVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(crvvertices), GL.STATIC_DRAW);

    var crvnormalVBO = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(crvnormals), GL.STATIC_DRAW);

    var crvindexEBO = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(crvindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO);

    //curve kiri
    var crvvertexVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(crvvertices2), GL.STATIC_DRAW);

    var crvnormalVBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO2);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(crvnormals2), GL.STATIC_DRAW);

    var crvindexEBO2 = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO2);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(crvindices2), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO2);

    //cls
    var clsvertexVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, clsvertexVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(clsVertices), GL.STATIC_DRAW);

    var clsnormalVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, clsnormalVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(clsNormals), GL.STATIC_DRAW);

    var clstexCoordVBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, clstexCoordVBOhk);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(clsTexCoords), GL.STATIC_DRAW);

    var clsindexEBOhk = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, clsindexEBOhk);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(clsindices), GL.STATIC_DRAW);

    GL.bindBuffer(GL.ARRAY_BUFFER, clsvertexVBOhk);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, clsnormalVBOhk);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    // Animate
    var prev_time = 0;
    var currentState = 'moveRight'; 
    var moveDuration = 3000;
    var moveDistance = 10;
    var startTime = 0;
    var rotateZAngle = 0; 
    var rotateZSpeed = 2; 
    var rotateYAngle = 0; 
    var rotateYSpeed = 2;
    var maxRotateZAngle = Math.PI / 6; 
    var maxRotateYAngle = Math.PI / 6;
    var rotateZAngletk = 0; // Initial angle for rotateZ animation
    var rotateZSpeedtk = 1; // Speed of rotation in radians per frame
    var rotateYAngletk = 0; // Initial angle for rotateZ animation
    var rotateYSpeedtk = 1; // Speed of rotation in radians per frame
    var maxRotateZAngletk = Math.PI / 12; // Maximum angle before reversing direction
    var maxRotateYAngletk = Math.PI / 16;
    var minScale = 0.8; // Minimum scale factor
    var maxScale = 1.2; // Maximum scale factor
    var scaleSpeed = 0.001; // Speed of scaling change per millisecond
    var minRadius = 0.6; // Minimum radius
    var maxRadius = 1.2; // Maximum radius
    var scaleFactor = minScale; // Initial scale factor
    var scalingDirection = 1; // Initial scaling direction (1 for increasing, -1 for decreasing)
    GL.enable(GL.DEPTH_TEST);

    GL.enable(GL.DEPTH_TEST);

    var animate = function (time) {
        GL.clearColor(0.0, 0.0, 1.0, 1.0);
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        var dt = time - prev_time;

        if (!drag) {
            dx *= FRICTION;
            dy *= FRICTION;
            ALPHA += dy;
            THETA += dx;
    
            // Clamp angles within limits
            ALPHA = Math.max(Math.min(ALPHA, MAX_ALPHA), MIN_ALPHA);
            THETA = Math.max(Math.min(THETA, MAX_THETA), MIN_THETA);
        }
    
        view_matrix = LIBS.get_I4();
        LIBS.rotateX(view_matrix, ALPHA);
        LIBS.rotateY(view_matrix, THETA);
        LIBS.translateZ(view_matrix, -180);
        switch (currentState) {
            case 'moveRight':
                var elapsedTimeRight = time - startTime;
                if (elapsedTimeRight >= moveDuration) {
                   
                    currentState = 'moveLeft';
                    startTime = time;
                }
                var translationAmountRight = (elapsedTimeRight / moveDuration) * moveDistance;
                animateTranslation(translationAmountRight);
                break;

            case 'moveLeft':
                var elapsedTimeLeft = time - startTime;
                if (elapsedTimeLeft >= moveDuration) {
                 
                    currentState = 'moveBack';
                    startTime = time; 
                }
                var translationAmountLeft = moveDistance - ((elapsedTimeLeft / moveDuration * 2) * moveDistance);
                animateTranslation(translationAmountLeft);
                break;

            case 'moveBack':
                var elapsedTimeBack = time - startTime;
                if (elapsedTimeBack >= moveDuration) {
                    
                    currentState = 'moveRight';
                    startTime = time;
                }
              
                var progress = (moveDuration - elapsedTimeBack) / moveDuration;
                var translationAmountBack = progress * moveDistance;
                animateTranslation(-translationAmountBack); 
                break;
            default:
                break;
        }

        function animateTranslation(translationAmount) {
    //badzmaru
    setColorUniform([0.0, 0.0, 0.0]);
    //head
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25, 3, 0]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180);
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, headvertex_vbo1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, headnormal_vbo1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headindex_ebo1);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, headindices1.length, GL.UNSIGNED_SHORT, 0);

    //hair
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-24, 14.2, 0]);
    LIBS.rotateZ(model_matrix, -5 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, hairIndices.length, GL.UNSIGNED_SHORT, 0);
    //
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-33.5, 11, 0]);
    LIBS.rotateZ(model_matrix, 35 * Math.PI / 180);
    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO2);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO2);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO2);
    GL.drawElements(GL.TRIANGLES, hairIndices2.length, GL.UNSIGNED_SHORT, 0);
    //
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-29, 13, 0]);
    LIBS.rotateZ(model_matrix, 20 * Math.PI / 180);
    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO3);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO3);
    GL.drawElements(GL.TRIANGLES, hairIndices3.length, GL.UNSIGNED_SHORT, 0);
    //
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-19, 12, 0]);
    LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairVertexVBO4);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, hairNormalVBO4);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, hairIndexEBO4);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, hairIndices4.length, GL.UNSIGNED_SHORT, 0);
    
    //mata eye
    //mata putih kiri
    setColorUniform([1.0, 1.0, 1.0]);
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-26, 3, 5]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180);
    LIBS.rotateY(model_matrix,  90* Math.PI / 180);

    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO1);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO1);
    GL.drawElements(GL.TRIANGLES, eyeindices1.length/2, GL.UNSIGNED_SHORT, 0);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //mata putih kanan
    setColorUniform([1.0, 1.0, 1.0]);
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-22, 3, 4.1]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180);
    LIBS.rotateY(model_matrix,  90* Math.PI / 180);

    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO3);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO3);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2);
    GL.drawElements(GL.TRIANGLES, eyeindices3.length/2, GL.UNSIGNED_SHORT, 0);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

    //bola mata kanan
    setColorUniform([0, 0, 0]);
    // Apply scaling animation to the sphere representing the left eye
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-21,3, 7]); // Translate to the initial position
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180); // Rotate if needed
    LIBS.rotateY(model_matrix, 90 * Math.PI / 180); // Rotate if needed

    // Apply scaling transformation
    scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time

    // Check if the scale factor exceeds the bounds
    if (scaleFactor > maxScale) {
        scaleFactor = maxScale;
        scalingDirection = -1; // Reverse scaling direction
    } else if (scaleFactor < minScale) {
        scaleFactor = minScale;
        scalingDirection = 1; // Reverse scaling direction
    }

    // Calculate the radius based on the scale factor
    var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
    var scaleVector = [currentRadius, currentRadius, currentRadius];

    LIBS.scale(model_matrix, scaleVector);

    LIBS.translateX(model_matrix, translationAmount); // Translate if needed

    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO1);
    GL.drawElements(GL.TRIANGLES, mataindices1.length, GL.UNSIGNED_SHORT, 0);



    
    //bola mata kiri
    setColorUniform([0, 0, 0]);
    // Apply scaling animation to the sphere representing the left eye
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25,3, 8]); // Translate to the initial position
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180); // Rotate if needed
    LIBS.rotateY(model_matrix, 90 * Math.PI / 180); // Rotate if needed

    // Apply scaling transformation
    scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time

    // Check if the scale factor exceeds the bounds
    if (scaleFactor > maxScale) {
        scaleFactor = maxScale;
        scalingDirection = -1; // Reverse scaling direction
    } else if (scaleFactor < minScale) {
        scaleFactor = minScale;
        scalingDirection = 1; // Reverse scaling direction
    }

    // Calculate the radius based on the scale factor
    var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
    var scaleVector = [currentRadius, currentRadius, currentRadius];

    LIBS.scale(model_matrix, scaleVector);

    LIBS.translateX(model_matrix, translationAmount); // Translate if needed

    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, matavertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, matanormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mataindexEBO1);
    GL.drawElements(GL.TRIANGLES, mataindices1.length, GL.UNSIGNED_SHORT, 0);
    //body
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25, 4, 0]);
    LIBS.rotateZ(model_matrix, -3  * Math.PI / 180);
    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO1);
    GL.drawElements(GL.TRIANGLES, bodyIndices5.length, GL.UNSIGNED_SHORT, 0);

    //tangan kanan
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-17, -5, 0]);
    LIBS.rotateY(model_matrix,0* Math.PI / 180)
    LIBS.rotateZ(model_matrix, -115 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    if (Math.abs(rotateYAngletk) >= maxRotateYAngletk) {
        rotateYSpeedtk *= -1; // Reverse direction
    }
    rotateYAngletk += rotateYSpeedtk * dt / 1000; // Convert milliseconds to seconds

    LIBS.rotateZ(model_matrix, rotateYAngletk);
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, tanganIndices.length, GL.UNSIGNED_SHORT, 0);
    //tangan kiri
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-34,-5, 0]);
    LIBS.rotateY(model_matrix,0* Math.PI / 180)
    LIBS.rotateZ(model_matrix, 115 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    if (Math.abs(rotateYAngletk) >= maxRotateYAngletk) {
        rotateYSpeedtk *= -1; // Reverse direction
    }
    rotateYAngletk += rotateYSpeedtk * dt / 1000; // Convert milliseconds to seconds

    LIBS.rotateZ(model_matrix, rotateYAngletk);
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganVertexVBO1);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, tanganNormalVBO1);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tanganIndexEBO1);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, tanganIndices1.length, GL.UNSIGNED_SHORT, 0);

    //perut
    setColorUniform([1., 1., 1.]);
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25, -7,1.5]);
    LIBS.rotateX(model_matrix, 275 * Math.PI / 180);
    LIBS.rotateY(model_matrix,  90* Math.PI / 180);

    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, perutvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, perutnormalVBO);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, perutindexEBO);
    GL.drawElements(GL.TRIANGLES, perutindices.length/2, GL.UNSIGNED_SHORT, 0);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


    //tutup bawah
    setColorUniform([0.0, 0.0, 0.0]);
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25.5, -7.8,0.1]);
    LIBS.rotateX(model_matrix,87* Math.PI / 180)
    
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, tutupVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, tutupNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tutupIndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, tutupIndices.length, GL.UNSIGNED_SHORT, 0);
    setColorUniform([1.0, 1.0, 0.0]);
    //cylinder kaki kanan
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-29   , -6, 1.5]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, ckkVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, ckkNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckkIndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, ckkIndices.length, GL.UNSIGNED_SHORT, 0);

    //cylinder kaki kiri
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-22, -6, 1.5]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1VertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, ckk1NormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ckk1IndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, ckk1Indices.length, GL.UNSIGNED_SHORT, 0);

    //sphere kaki kiri
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-29, -10, 1.5]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, skk1VertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, skk1NormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skk1IndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, skk1Indices.length, GL.UNSIGNED_SHORT, 0);

    //sphere kaki kanan
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-22, -10, 1.5]);
    LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, skkVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, skkNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skkIndexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, skkIndices.length, GL.UNSIGNED_SHORT, 0);
    
    //hidung kuning
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-23.7, 2, 6]);
    LIBS.rotateZ(model_matrix,0 * Math.PI / 180);
    
    LIBS.translateX(model_matrix, translationAmount);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.bindBuffer(GL.ARRAY_BUFFER, nosekuningVertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, nosekuningNormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, nosekuningIndexEBO);
    GL.drawElements(GL.TRIANGLES, nosekuningIndices.length, GL.UNSIGNED_SHORT, 0);

    //paruh curve
    setColorUniform([0.0, 0.0, 0.0]);
    model_matrix = LIBS.get_I4();
    LIBS.translate(model_matrix, [-25, -1,5.9]);
    LIBS.rotateX(model_matrix,90 * Math.PI / 180);
    LIBS.rotateY(model_matrix,30 * Math.PI / 180);

    LIBS.translateX(model_matrix, translationAmount);
    GL.bindBuffer(GL.ARRAY_BUFFER, paruhvertexVBO);
    GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ARRAY_BUFFER, paruhnormalVBO);
    GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, paruhindexEBO);
    GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
    GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
    GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
    GL.drawElements(GL.TRIANGLES, paruhindices.length, GL.UNSIGNED_SHORT, 0);


          
            setColorUniform([0.0, 0.0, 0.0]);
            //head
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [0, 3, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180);
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, headvertex_vbo);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, headnormal_vbo);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headindex_ebo);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, headindices.length, GL.UNSIGNED_SHORT, 0);

            //tail
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-0, -10, 0]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, tailvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, tailnormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tailindexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);

            //rotate
            if (Math.abs(rotateZAngle) >= maxRotateZAngle) {
                rotateZSpeed *= -1; 
            }
            rotateZAngle += rotateZSpeed * dt / 1000; 
            LIBS.rotateZ(model_matrix, rotateZAngle);

            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, tailindices.length, GL.UNSIGNED_SHORT, 0);

            //foot
            model_matrix = LIBS.get_I4();
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.translate(model_matrix, [2, -12, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, rotateZAngle);
            GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, footIndices.length, GL.UNSIGNED_SHORT, 0);

            //foot2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-2, -12, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.rotateZ(model_matrix, rotateZAngle);
            GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO2);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, footIndices2.length, GL.UNSIGNED_SHORT, 0);

            //arm
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [4.4, -7, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            if (Math.abs(rotateYAngle) >= maxRotateYAngle) {
                rotateYSpeed *= -1; // Reverse direction
            }
            rotateYAngle += rotateYSpeed * dt / 1000; 

            LIBS.rotateZ(model_matrix, rotateYAngle);

            GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, armIndices.length, GL.UNSIGNED_SHORT, 0);

            //arm2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-4.4, -7, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, rotateYAngle);
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO2);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, armIndices2.length, GL.UNSIGNED_SHORT, 0);

            //body
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [0, -3, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, bodyVertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, bodyNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bodyIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, bodyIndices.length, GL.UNSIGNED_SHORT, 0);

            //whisker
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [4, -1.5, 6.5]);
            LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, whiskerIndices.length, GL.UNSIGNED_SHORT, 0);

            //whisker2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [4, -1.5, 6.5]);
            LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, whiskerIndices2.length, GL.UNSIGNED_SHORT, 0);

            //whisker3
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-4, -1.5, 6.5]);
            LIBS.rotateY(model_matrix, -90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, whiskerIndices3.length, GL.UNSIGNED_SHORT, 0);

            //whisker4
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-4, -1.5, 6.5]);
            LIBS.rotateY(model_matrix, -90 * Math.PI / 180)
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, whiskerIndices4.length, GL.UNSIGNED_SHORT, 0);

            //bottom
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [0, -10, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180);
            GL.bindBuffer(GL.ARRAY_BUFFER, bottomVertexVBO);
            LIBS.translateX(model_matrix, translationAmount);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, bottomNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, bottomIndices.length, GL.UNSIGNED_SHORT, 0);

            //ear
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [8, 13, 0]);
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, earIndices.length, GL.UNSIGNED_SHORT, 0);
            //ear2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-8, 13, 0]);
            LIBS.rotateZ(model_matrix, 30 * Math.PI / 180);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2);
            GL.drawElements(GL.TRIANGLES, earIndices2.length, GL.UNSIGNED_SHORT, 0);

            //pupil
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-2.5, 1.5, 9.9]);
            LIBS.translateX(model_matrix, translationAmount);
            scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time

            // Check if the scale factor exceeds the bounds
            if (scaleFactor > maxScale) {
                scaleFactor = maxScale;
                scalingDirection = -1; // Reverse scaling direction
            } else if (scaleFactor < minScale) {
                scaleFactor = minScale;
                scalingDirection = 1; // Reverse scaling direction
            }
        
            // Calculate the radius based on the scale factor
            var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
            var scaleVector = [currentRadius, currentRadius, currentRadius];
        
            LIBS.scale(model_matrix, scaleVector);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, pupilindexEBO);
            GL.drawElements(GL.TRIANGLES, pupilindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //pupil2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [2.5, 1.5, 9.9]);
            scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time

            // Check if the scale factor exceeds the bounds
            if (scaleFactor > maxScale) {
                scaleFactor = maxScale;
                scalingDirection = -1; // Reverse scaling direction
            } else if (scaleFactor < minScale) {
                scaleFactor = minScale;
                scalingDirection = 1; // Reverse scaling direction
            }
        
            // Calculate the radius based on the scale factor
            var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
            var scaleVector = [currentRadius, currentRadius, currentRadius];
        
            LIBS.scale(model_matrix, scaleVector);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, pupilvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, pupilnormalVBO2);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, pupilindexEBO2);
            GL.drawElements(GL.TRIANGLES, pupilindices2.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            setColorUniform([1.0, 1.0, 1.0]);
            //eye
            model_matrix = LIBS.get_I4();
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.translate(model_matrix, [-3, 1.7, 8.7]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO);
            GL.drawElements(GL.TRIANGLES, eyeindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //eye2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [3, 1.7, 8.7]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2);
            GL.drawElements(GL.TRIANGLES, eyeindices2.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            setColorUniform([0.6666, 0.4549, 0.2509]);
            //nose
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [0, -1, 8]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBO);
            GL.drawElements(GL.TRIANGLES, noseindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            setColorUniform([0.996, 0.913, 0.670]);
            //inner ear
            model_matrix = LIBS.get_I4();
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.translate(model_matrix, [7.5, 12, 0.9]);
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, innerearIndices.length, GL.UNSIGNED_SHORT, 0);

            //inner ear2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-7.5, 12, 0.9]);
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
            GL.bindBuffer(GL.ARRAY_BUFFER, innerearVertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, innerearNormalVBO2);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, innerearIndexEBO2);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, innerearIndices2.length, GL.UNSIGNED_SHORT, 0);

            setColorUniform([0.411, 0.643, 0.850]);
            //neck
            model_matrix = LIBS.get_I4();
            LIBS.translateX(model_matrix, translationAmount);
            LIBS.translate(model_matrix, [0, -4, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            GL.bindBuffer(GL.ARRAY_BUFFER, neckVertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, neckNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, neckIndices.length, GL.UNSIGNED_SHORT, 0);


            setColorUniform([0.152, 0.647, 0.039]);
            //floor
            model_matrix = LIBS.get_I4();
            
            LIBS.translate(model_matrix, [0, -15, 0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            GL.bindBuffer(GL.ARRAY_BUFFER, floorvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, floornormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, floorindexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, floorindices.length, GL.UNSIGNED_SHORT, 0);
            GL.flush();
            prev_time = time;
            
            setColorUniform([0, 0.603, 0.09]);
            //leaf
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-10, 40, -90]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //leaf2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [10, 40, -90]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO2);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO2);
            GL.drawElements(GL.TRIANGLES, leafindices2.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //leaf3
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [0, 60, -90]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            
             //leaf5
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [0, 40, -80]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

           //leaf 6
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [0, 40, -100]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //leaf
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [40, 40, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //leaf2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [60, 40, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO2);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO2);
            GL.drawElements(GL.TRIANGLES, leafindices2.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //leaf3
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [50, 60, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            
             //leaf5
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [50, 40, -35]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

           //leaf 6
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [50, 40, -55]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

             



            //bush
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-50, -10, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            
            //bush2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-30, -10, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
          
            //bush3
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-45, 3, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            

             //bush
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [80, -10, -45]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
             
             //bush2
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [100, -10, -45]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
           
             //bush3
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [93, 3, -45]);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
             GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
             
            setColorUniform([0.627, 0.321, 0.176]);
             //stem
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [50, -15, -45]);
             LIBS.rotateX(model_matrix, -90 * Math.PI / 180);
      
             GL.bindBuffer(GL.ARRAY_BUFFER, stemvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, stemnormalVBO);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, stemindexEBO);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.drawElements(GL.TRIANGLES, stemIndices.length, GL.UNSIGNED_SHORT, 0);

             //stem2
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [0, -15, -95]);
             LIBS.rotateX(model_matrix, -90 * Math.PI / 180);
      
             GL.bindBuffer(GL.ARRAY_BUFFER, stemvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, stemnormalVBO);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, stemindexEBO);
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.drawElements(GL.TRIANGLES, stemIndices.length, GL.UNSIGNED_SHORT, 0);
             setColorUniform([1, 1, 1]);
            //cloud
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-100, 80, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //cloud2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-110, 60, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);  
            
            //cloud3
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-80, 60, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);


            //cloud4
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-80, 85, -45]);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, leafnormalVBO3);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leafindexEBO);
            GL.drawElements(GL.TRIANGLES, leafindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            

        
            setColorUniform([0.4, 0, 0]);
             //tent
             model_matrix = LIBS.get_I4();
             LIBS.translate(model_matrix, [-105, -15, -10]);
             LIBS.rotateX(model_matrix, -90 * Math.PI / 180)
             GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
             GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
             GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
             GL.bindBuffer(GL.ARRAY_BUFFER, tentvertexVBO);
             GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
             GL.bindBuffer(GL.ARRAY_BUFFER, tentnormalVBO);
             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tentindexEBO);
             GL.drawElements(GL.TRIANGLES, tentindices.length, GL.UNSIGNED_SHORT, 0);
             GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
   
             setColorUniform([0, 0, 0]);
             //door
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [-97, 14, 3]);
            LIBS.rotateX(model_matrix, -25 * Math.PI / 180);
            LIBS.rotateY(model_matrix, 40 * Math.PI / 180);
            GL.bindBuffer(GL.ARRAY_BUFFER, doorVertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, doorNormalVBO);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, doorIndexEBO);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, doorIndices.length, GL.UNSIGNED_SHORT, 0);

            //hellokitty

            setColorUniform([1.0, 1.0, 1.0]);

            //head
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [25, 3,0]);
            LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, headhkvertex_vbo);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, headhknormal_vbo);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, headhkindex_ebo);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, headhkindices.length, GL.UNSIGNED_SHORT, 0);

            //neck hk
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [25, -5, 0.5]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, neckvertexVBOhk);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, necknormalVBOhk);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, neckindexEBOhk);
            GL.drawElements(GL.TRIANGLES, neckhkindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

            //button
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [22, -7, 2.5]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO);
            GL.drawElements(GL.TRIANGLES, buttonindices.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

           //button2
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [27, -7, 3]);
            LIBS.translateX(model_matrix, translationAmount);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.bindBuffer(GL.ARRAY_BUFFER, buttonvertexVBO2);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, buttonnormalVBO2);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buttonindexEBO2);
            GL.drawElements(GL.TRIANGLES, buttonindices2.length, GL.UNSIGNED_SHORT, 0);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

           //ear
            model_matrix = LIBS.get_I4();
            LIBS.translate(model_matrix, [33, 13, 0]);
            LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
            LIBS.translateX(model_matrix, translationAmount);
            GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBOhk);
            GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBOhk);
            GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBOhk);
            GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
            GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
            GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
            GL.drawElements(GL.TRIANGLES, earIndiceshk.length, GL.UNSIGNED_SHORT, 0);
          //ear2
           model_matrix = LIBS.get_I4();
           LIBS.translate(model_matrix, [17, 13, 0]);
           LIBS.rotateZ(model_matrix, 30 * Math.PI / 180); 
           LIBS.translateX(model_matrix, translationAmount);
           GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
           GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
           GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
           GL.bindBuffer(GL.ARRAY_BUFFER, earVertexVBO2hk);
           GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
           GL.bindBuffer(GL.ARRAY_BUFFER, earNormalVBO2hk);
           GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
           GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, earIndexEBO2hk);
           GL.drawElements(GL.TRIANGLES, earIndices2hk.length, GL.UNSIGNED_SHORT, 0);

          //foot
           model_matrix = LIBS.get_I4();
           LIBS.translate(model_matrix, [28, -12, 0]);
           LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
           LIBS.translateX(model_matrix, translationAmount);

           GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBOhk);
           GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
           GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBOhk);
           GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
           GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBOhk);
           GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
           GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
           GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
           GL.drawElements(GL.TRIANGLES, footindiceshk.length, GL.UNSIGNED_SHORT, 0);

         //foot2
          model_matrix = LIBS.get_I4();
          LIBS.translate(model_matrix, [23, -12, 0]);
          LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
          LIBS.translateX(model_matrix, translationAmount);

          GL.bindBuffer(GL.ARRAY_BUFFER, footvertexVBO2hk);
          GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ARRAY_BUFFER, footnormalVBO2hk);
          GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, footindexEBO2hk);
          GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
          GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
          GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
          GL.drawElements(GL.TRIANGLES, footindices2hk.length, GL.UNSIGNED_SHORT, 0);

         //arm hk
          model_matrix = LIBS.get_I4();
          LIBS.translate(model_matrix, [30, -6, 0]);
          LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
          LIBS.rotateZ(model_matrix, -120 * Math.PI / 180)
       
          LIBS.translateX(model_matrix, translationAmount);
          if (Math.abs(rotateYAngle) >= maxRotateYAngle) {
              rotateYSpeed *= -1; // Reverse direction
          }
          rotateYAngle += rotateYSpeed * dt / 1000; 

          LIBS.rotateX(model_matrix, rotateYAngle);

          GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBOhk);
          GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBOhk);
          GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBOhk);
          GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
          GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
          GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
          GL.drawElements(GL.TRIANGLES, armIndiceshk.length, GL.UNSIGNED_SHORT, 0);
       
          //arm2
          model_matrix = LIBS.get_I4();
          LIBS.translate(model_matrix, [20, -6, 0]);
          LIBS.rotateX(model_matrix, 90 * Math.PI / 180)
          LIBS.rotateZ(model_matrix, -60 * Math.PI / 180)
          LIBS.translateX(model_matrix, translationAmount);
          if (Math.abs(rotateYAngle) >= maxRotateYAngle) {
              rotateYSpeed *= -1; // Reverse direction
           }
          rotateYAngle += rotateYSpeed * dt / 1000; // Convert milliseconds to seconds
          LIBS.rotateX(model_matrix, rotateYAngle);
          GL.bindBuffer(GL.ARRAY_BUFFER, armvertexVBO2hk);
          GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ARRAY_BUFFER, armnormalVBO2hk);
          GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, armindexEBO2hk);
          GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
          GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
          GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
          GL.drawElements(GL.TRIANGLES, armIndices2hk.length, GL.UNSIGNED_SHORT, 0);

          setColorUniform([0.0, 0.0, 0.0]);
          //eye
          model_matrix = LIBS.get_I4();
          LIBS.translate(model_matrix, [22, 1.7, 7]);
          // Apply scaling transformation
          scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time
          // Check if the scale factor exceeds the bounds
          if (scaleFactor > maxScale) {
              scaleFactor = maxScale;
              scalingDirection = -1; // Reverse scaling direction
          } else if (scaleFactor < minScale) {
              scaleFactor = minScale;
              scalingDirection = 1; // Reverse scaling direction
          }
         // Calculate the radius based on the scale factor
          var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
          var scaleVector = [currentRadius, currentRadius, currentRadius];
          LIBS.scale(model_matrix, scaleVector);
          LIBS.translateX(model_matrix, translationAmount);
          GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
          GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
          GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
          GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBOhk);
          GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
          GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBOhk);
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBOhk);
          GL.drawElements(GL.TRIANGLES, eyeindiceshk.length, GL.UNSIGNED_SHORT, 0);
          GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

          //eye2
          model_matrix = LIBS.get_I4();
          LIBS.translate(model_matrix, [28, 1.7, 7]);
          // Apply scaling transformation
          scaleFactor += scaleSpeed * dt * scalingDirection; // Update the scale factor based on time
        // Check if the scale factor exceeds the bounds
        if (scaleFactor > maxScale) {
            scaleFactor = maxScale;
            scalingDirection = -1; // Reverse scaling direction
        } else if (scaleFactor < minScale) {
            scaleFactor = minScale;
            scalingDirection = 1; // Reverse scaling direction
        }

        // Calculate the radius based on the scale factor
        var currentRadius = minRadius + (maxRadius - minRadius) * scaleFactor;
        var scaleVector = [currentRadius, currentRadius, currentRadius];

        LIBS.scale(model_matrix, scaleVector);
        
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, eyevertexVBO2hk2);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, eyenormalVBO2hk2);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, eyeindexEBO2hk2);
        GL.drawElements(GL.TRIANGLES, eyeindices2hk.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

         //whisker
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [29, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBOhk);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBOhk);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBOhk);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndiceshk.length, GL.UNSIGNED_SHORT, 0);
 
         //whisker2
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [29, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO2hk);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO2hk);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO2hk);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndices2hk.length, GL.UNSIGNED_SHORT, 0);
 
         //whisker3
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [20.5, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, -90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, 30 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO3hk);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO3hk);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO3hk);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndices3hk.length, GL.UNSIGNED_SHORT, 0);
 
         //whisker4
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [20.5, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, -90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, -30 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO4hk);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO4hk);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO4hk);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndices4hk.length, GL.UNSIGNED_SHORT, 0);
 
         //whisker5
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [29, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, 0 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO5);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO5);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO5);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndices5.length, GL.UNSIGNED_SHORT, 0);
 
         //whisker6
         model_matrix = LIBS.get_I4();
         LIBS.translate(model_matrix, [16, 2.5, 6.0]);
         LIBS.rotateY(model_matrix, 90 * Math.PI / 180)
         LIBS.rotateZ(model_matrix, 0 * Math.PI / 180)
         LIBS.translateX(model_matrix, translationAmount);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskervertexVBO6);
         GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ARRAY_BUFFER, whiskernormalVBO6);
         GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, whiskerindexEBO6);
         GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
         GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
         GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
         GL.drawElements(GL.TRIANGLES, whiskerIndices6.length, GL.UNSIGNED_SHORT, 0);


        setColorUniform([0.9764, 0.5294, 0.7725]);
        //Acc
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [27, 7, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO);
        GL.drawElements(GL.TRIANGLES, accindices.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

        //cone body
        setColorUniform([0.9764, 0.5294, 0.7725]);
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [25, -10,0]);
        LIBS.rotateX(model_matrix, -90 * Math.PI / 180)
        LIBS.translateX(model_matrix, translationAmount);
        GL.bindBuffer(GL.ARRAY_BUFFER, coneVertexVBO);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, coneNormalVBO);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, coneIndexEBO);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.drawElements(GL.TRIANGLES, coneindices.length, GL.UNSIGNED_SHORT, 0);

        //curve
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [28, 7, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.drawElements(GL.TRIANGLES, crvindices.length, GL.UNSIGNED_SHORT, 0);

        //curve 2
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [26, 7.2, 7.4]);
        LIBS.rotateX(model_matrix, 0 * Math.PI / 180)
        LIBS.rotateZ(model_matrix, 0 * Math.PI / 180)
        LIBS.rotateY(model_matrix, 90 * Math.PI /180)
        LIBS.translateX(model_matrix, translationAmount);
        GL.bindBuffer(GL.ARRAY_BUFFER, crvvertexVBO);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, crvnormalVBO);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, crvindexEBO);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.drawElements(GL.TRIANGLES, crvindices.length, GL.UNSIGNED_SHORT, 0);

        // Cls
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [25, -10,0]);
        LIBS.rotateX(model_matrix, -90 * Math.PI / 180)
        LIBS.translateX(model_matrix, translationAmount);
        GL.bindBuffer(GL.ARRAY_BUFFER, clsvertexVBOhk);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, clsnormalVBOhk);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, clsindexEBOhk);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.drawElements(GL.TRIANGLES, clsindices.length, GL.UNSIGNED_SHORT, 0);

        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [28, 7, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO2);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO2);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO2);
        GL.drawElements(GL.TRIANGLES, accindices2.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
        
        setColorUniform([0.1765, 0.4706, 0.7843]);
        //Acc rearKanan
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [28, 7, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO2);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO2);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO2);
        GL.drawElements(GL.TRIANGLES, accindices2.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

        //Acc rearKiri
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [26, 7, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, accvertexVBO3);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, accnormalVBO3);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, accindexEBO3);
        GL.drawElements(GL.TRIANGLES, accindices3.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);

        setColorUniform([1.0, 1.0, 0.0]);
        //nose
        model_matrix = LIBS.get_I4();
        LIBS.translate(model_matrix, [25, 0, 7]);
        LIBS.translateX(model_matrix, translationAmount);
        GL.uniformMatrix4fv(uniform_projection_matrix, false, projection_matrix);
        GL.uniformMatrix4fv(uniform_view_matrix, false, view_matrix);
        GL.uniformMatrix4fv(uniform_model_matrix, false, model_matrix);
        GL.bindBuffer(GL.ARRAY_BUFFER, nosevertexVBOhk);
        GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, nosenormalVBOhk);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, noseindexEBOhk);
        GL.drawElements(GL.TRIANGLES, noseindiceshk.length, GL.UNSIGNED_SHORT, 0);
        GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);






             window.requestAnimationFrame(animate);
 

            
        }
    }

    animate(0);
}


window.addEventListener("load", main);





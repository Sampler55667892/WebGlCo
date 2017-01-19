var model;
var view;
var workingHoursSet = [];
var maxDays = 31;
var xyDivisions = 2;
var xzDivisions = 24;
var yzDivisions = maxDays;

function onLoad() {
    sendAsync(2016, 11, function (data) {
        workingHoursSet.push(data);
        $("#hs201611").text(data.toString());
        sendAsync(2016, 12, function (data) {
            workingHoursSet.push(data);
            $("#hs201612").text(data.toString());
            sendAsync(2017, 1, function (data) {
                workingHoursSet.push(data);
                $("#hs201701").text(data.toString());
                startThree();
            });
        });
    });
}

function sendAsync(year, month, callback) {
    $.ajax({
        method: "GET",
        url: "/Graph3D/GetWorkingHours?year=" + year + "&month=" + month,
        data: null,
        dataType: "json"
    }).done(callback);
}

function startThree() {
    model = new Model();
    view = new View(model, "canvas-frame");

    initThree(view);
    init3DObjects(model);
    mainloop();
}

function initThree(v) {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(v.canvasFrame.clientWidth, v.canvasFrame.clientHeight);
    v.setRenderer(renderer);

    v.canvasFrame.appendChild(v.renderer.domElement);

    v.renderer.setClearColor(0xEEEEFF, 1.0);
    v.camera.up.set(0, 0, 1);
    v.camera.position.set(90, 80, 50);
}

function init3DObjects(m) {
    var halfSize = 25.0;
    var size = halfSize * 2.0;

    initGrid(m, halfSize);
    initCoordinate(m, size);
    init3DGraph(m, size);
}

function initCoordinate(m, size) {
    var origin = new THREE.Vector3(0, 0, 0);
    var xAxis = createLine(origin, new THREE.Vector3(size, 0, 0), 0x00ff00);
    var yAxis = createLine(origin, new THREE.Vector3(0, size, 0), 0x00ffff);
    var zAxis = createLine(origin, new THREE.Vector3(0, 0, size), 0xDDDDDD);

    m.addObject(xAxis);
    m.addObject(yAxis);
    m.addObject(zAxis);
}

function initGrid(m, halfSize) {
    var gridXY = new THREE.GridHelper(halfSize, xyDivisions);  // デフォルトはxz平面
    // xy平面で端が (0, 0, 0) に一致するように平行移動 + 回転
    gridXY.translateX(halfSize);
    gridXY.translateY(halfSize);
    gridXY.rotation.set(Math.PI / 2.0, 0, 0); 

    var gridXZ = new THREE.GridHelper(halfSize, xzDivisions);
    // 端が (0, 0, 0) に一致するように平行移動
    gridXZ.translateX(halfSize);
    gridXZ.translateZ(halfSize);

    var gridYZ = new THREE.GridHelper(halfSize, yzDivisions);
    // yz平面で端が (0, 0, 0) に一致するように平行移動
    gridYZ.translateY(halfSize);
    gridYZ.translateZ(halfSize);
    gridYZ.rotation.set(0, 0, Math.PI / 2.0); 

    m.addObject(gridXY);
    m.addObject(gridXZ);
    m.addObject(gridYZ);
}

function init3DGraph(m, size) {
    var _p = function (x, y, z) {
        return new THREE.Vector3(x, y, z);
    }
    var xValues = [0, size / 2.0, size];
    var colors = [0x0000ff, 0xff00ff, 0xff0000];
    var yScale = size / (maxDays - 1.0);
    var zScale = size / xzDivisions;

    for (var i = 0; i < workingHoursSet.length; ++i) {
        var points = [];
        var x = xValues[i];
        var workingHours = workingHoursSet[i];
        for (var j = 0; j < maxDays; ++j) {
            var y = yScale * j;
            var z = 0;
            if (j < workingHours.length) {
                z = workingHours[j];
            }
            z *= zScale;
            points.push(_p(x, y, z));
        }
        var line = createPolygonalLine(points, colors[i]);
        m.addObject(line);
    }
}

function createLine(start, end, color) {
    var geometry = new THREE.Geometry();
    geometry.vertices[0] = start;
    geometry.vertices[1] = end;

    var material = new THREE.LineBasicMaterial({ color: color });

    var line = new THREE.Line(geometry, material);
    line.position.set(0, 0, 0);

    return line;
}

function createPolygonalLine(points, color) {
    var geometry = new THREE.Geometry();
    var index = 0;
    points.forEach (function (p) {
        geometry.vertices[index] = p;
        ++index;
    });
    var material = new THREE.LineBasicMaterial({ color: color });

    var line = new THREE.Line(geometry, material);
    line.position.set(0, 0, 0);

    return line;
}

function mainloop() {
    view.updateTrackball();
    view.render();

    requestAnimationFrame(mainloop);
}

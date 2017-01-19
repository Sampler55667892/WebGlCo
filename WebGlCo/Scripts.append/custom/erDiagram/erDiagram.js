var model;
var view;
var layerA = [];
var layerB = [];
var entityGroupA = [];
var entityGroupB = [];
var entityBoardWidth = 70;
var xIntervalBoard = 30;
var yIntervalBoard = 30;
var offsetLayerADefault = new THREE.Vector3(-80, 50, -10);
var offsetLayerBDefault = new THREE.Vector3(-80, 50, -160);
var yRelationOffset = 17;

var Entity = (function () {
    function Entity(title, columnNames, countPKs) {
        this.title = title;
        this.columnNames = columnNames;
        this.countPKs = countPKs;
    }
    Entity.prototype.toArray = function () {
        var a = [this.title];
        this.columnNames.forEach(function (ob) {
            a.push(ob);
        });
        return a;
    }
    return Entity;
}());

function onLoad() {
    document.getElementById("translucenceCheck").checked = false;

    // LayerAのデータをサーバから取得
    sendAsync("A", function (data) {
        data.forEach(function (d) {
            var entity = new Entity(d.title, d.columnNames, d.countPKs);
            entityGroupA.push(entity);
        });
        // LayerBのデータをサーバから取得
        sendAsync("B", function (data) {
            data.forEach(function (d) {
                var entity = new Entity(d.title, d.columnNames, d.countPKs);
                entityGroupB.push(entity);
            });
            startThree();
        });
    });
}

function sendAsync(layerId, callback) {
    $.ajax({
        url: "/ERDiagram/GetEntities?layerId=" + layerId,
        method: "GET",
        dataType: "json"
    }).done(callback)
    .fail(function () {
        alert("fail at getting data of " + layerId);
    });
}

function startThree() {
    model = new Model();
    view = new View(model, "canvas-frame");

    initThree(view);
    init3DObjects(model, false);
    mainloop();
}

function focusLayerA() {
    var zLayerA = layerA[0].position.z;
    var zLayerB = layerB[0].position.z;

    if (zLayerA == offsetLayerADefault.z) {
        return;
    }
    translateLayer(layerA, zLayerB - zLayerA); // zLayerB = zLayerA + (zLayerB - zLayerA)
    translateLayer(layerB, zLayerA - zLayerB);
}

function focusLayerB() {
    var zLayerA = layerA[0].position.z;
    var zLayerB = layerB[0].position.z;

    if (zLayerB == offsetLayerADefault.z) {
        return;
    }
    translateLayer(layerA, zLayerB - zLayerA);
    translateLayer(layerB, zLayerA - zLayerB);
}

function makeTranslucence(isOn) {
    if (isOn) {
        makeTranslucenceLayer(layerA, 0.8);
        makeTranslucenceLayer(layerB, 0.8);
    } else {
        makeTranslucenceLayer(layerA, 1.0);
        makeTranslucenceLayer(layerB, 1.0);
    }
}

function makeTranslucenceLayer(layer, opacity) {
    layer.forEach( function (ob) {
        ob.material.opacity = opacity;
    });
}

function translateLayer(layer, z) {
    layer.forEach( function (ob) {
        ob.translateZ(z);
    });
}

function initThree(v) {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(v.canvasFrame.clientWidth, v.canvasFrame.clientHeight);
    v.setRenderer(renderer);

    v.canvasFrame.appendChild(v.renderer.domElement);

    v.renderer.setClearColor(0xEEEEFF, 1.0);
    v.camera.position.set(-30, 5, 200);
}

// ER図はミック氏の「達人に学ぶDB設計 徹底指南書」より借用
function init3DObjects(m, isTranslucence) {
    initLayerA(m, offsetLayerADefault);
    initLayerB(m, offsetLayerBDefault);

    makeTranslucence(isTranslucence);
}

function initLayerA(m, offsetDefault) {
    var entityA = entityGroupA[0];
    var entityB = entityGroupA[1];
    var entityC = entityGroupA[2];

    var boardHeightA = getEntityBoardHeight(entityA.toArray());

    // Entities
    var meshA = createEntityBoard(entityA.toArray(), entityA.countPKs, new THREE.Vector3(0, 0, 0).add(offsetDefault));
    var meshB = createEntityBoard(entityB.toArray(), entityB.countPKs, new THREE.Vector3(0, -boardHeightA - yIntervalBoard, 0).add(offsetDefault));
    var meshC = createEntityBoard(entityC.toArray(), entityC.countPKs, new THREE.Vector3(entityBoardWidth + xIntervalBoard, -boardHeightA - yIntervalBoard, 0).add(offsetDefault));

    // Relations
    var lineAB = createRelation(new THREE.Vector3(entityBoardWidth / 2, -boardHeightA, 0).add( offsetDefault),
        new THREE.Vector3(entityBoardWidth / 2, -boardHeightA - yIntervalBoard, 0).add( offsetDefault ), "1", "1M");
    var lineBC = createRelation(new THREE.Vector3(entityBoardWidth, -boardHeightA - yIntervalBoard - yRelationOffset, 0).add(offsetDefault),
        new THREE.Vector3(entityBoardWidth + xIntervalBoard, -boardHeightA - yIntervalBoard - yRelationOffset, 0).add(offsetDefault), "1M", "1");

    layerA.push(meshA);
    layerA.push(meshB);
    layerA.push(meshC);
    layerA.push(lineAB);
    layerA.push(lineBC);

    layerA.forEach( function (ob) {
        m.addObject(ob);
    });
}

function initLayerB(m, offsetDefault) {
    var entityA = entityGroupB[0];
    var entityB = entityGroupB[1];
    var entityC = entityGroupB[2];
    var entityD = entityGroupB[3];
    var entityE = entityGroupB[4];

    var boardHeightA = getEntityBoardHeight(entityA.toArray());
    var boardHeightB = getEntityBoardHeight(entityB.toArray());
    var boardHeightAB = boardHeightA + boardHeightB;

    // Entities
    var meshA = createEntityBoard(entityA.toArray(), entityA.countPKs, new THREE.Vector3(0, 0, 0).add(offsetDefault));
    var meshB = createEntityBoard(entityB.toArray(), entityB.countPKs, new THREE.Vector3(0, -boardHeightA - yIntervalBoard, 0).add(offsetDefault));
    var meshC = createEntityBoard(entityC.toArray(), entityC.countPKs, new THREE.Vector3(0, -boardHeightAB - yIntervalBoard * 2, 0).add(offsetDefault));
    var meshD = createEntityBoard(entityD.toArray(), entityD.countPKs, new THREE.Vector3(entityBoardWidth + xIntervalBoard, -boardHeightAB - yIntervalBoard * 2, 0).add(offsetDefault));
    var meshE = createEntityBoard(entityE.toArray(), entityE.countPKs, new THREE.Vector3((entityBoardWidth + xIntervalBoard) * 2, -boardHeightAB - yIntervalBoard * 2, 0).add(offsetDefault));

    // Relations
    var lineAB = createRelation(new THREE.Vector3( entityBoardWidth / 2, -boardHeightA, 0).add(offsetDefault),
        new THREE.Vector3(entityBoardWidth / 2, -boardHeightA - yIntervalBoard, 0).add(offsetDefault), "1", "1M");
    var lineBC = createRelation(new THREE.Vector3( entityBoardWidth / 2, -boardHeightA - yIntervalBoard - boardHeightB, 0).add(offsetDefault),
        new THREE.Vector3(entityBoardWidth / 2, -boardHeightA - yIntervalBoard * 2 - boardHeightB, 0).add(offsetDefault), "1", "1M");
    var lineCD = createRelation(new THREE.Vector3( entityBoardWidth, -boardHeightA - yIntervalBoard * 2 - boardHeightB - yRelationOffset, 0).add(offsetDefault),
        new THREE.Vector3(entityBoardWidth + xIntervalBoard, -boardHeightA - yIntervalBoard * 2 - boardHeightB - yRelationOffset, 0).add(offsetDefault), "1M", "1");
    var lineDE = createRelation(new THREE.Vector3( entityBoardWidth * 2 + xIntervalBoard, -boardHeightA - yIntervalBoard * 2 - boardHeightB - yRelationOffset, 0).add(offsetDefault),
        new THREE.Vector3((entityBoardWidth + xIntervalBoard) * 2, -boardHeightA - yIntervalBoard * 2 - boardHeightB - yRelationOffset, 0).add(offsetDefault), "1M", "1");

    layerB.push(meshA);
    layerB.push(meshB);
    layerB.push(meshC);
    layerB.push(meshD);
    layerB.push(meshE);
    layerB.push(lineAB);
    layerB.push(lineBC);
    layerB.push(lineCD);
    layerB.push(lineDE);

    layerB.forEach( function (ob) {
        m.addObject(ob);
    });
}

function createEntityBoard(columnNames, partitionCount, translation) {
    var xWidth = entityBoardWidth;
    var yHeight = getEntityBoardHeight(columnNames);
    var aspectRatio = yHeight / xWidth;

    // canvasを動的に生成
    var canvas = generateCanvas(columnNames[0], columnNames.slice(1), aspectRatio, partitionCount);

    // canvasからテクスチャーを生成
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });

    var geometry = new THREE.PlaneGeometry(xWidth, yHeight);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xWidth / 2.0 + translation.x, -yHeight / 2.0 + translation.y, 0.0 + translation.z);

    return mesh;
}

function generateCanvas(entityName, columnNames, aspectRatio, partitionCount) {
    var canvas = document.createElement("canvas");

    var yInterval = 30;
    var x0 = 10;
    var y0 = 30;
    var yOffset = 7;

    canvas.width = 256;
    canvas.height = 256 * aspectRatio;

    var context = canvas.getContext("2d");

    context.fillStyle = "rgb( 255, 255, 255 )";
    context.fillRect(0, 0, canvas.width, y0 + yOffset);

    var blueFade = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    blueFade.addColorStop(0.0, "#00ff00");
    blueFade.addColorStop(1.0, "#ffffff");
    context.fillStyle = blueFade;
    context.fillRect(0, y0 + yOffset, canvas.width, canvas.height - y0 - yOffset);

    context.font = "20px 'ＭＳ Ｐゴシック'";
    context.fillStyle = "rgb( 0, 0, 0 )"
    context.fillText(entityName, x0, y0);
    for (var i = 0; i < columnNames.length; ++i) {
        context.fillText(columnNames[i], x0, y0 + (i + 1) * yInterval);
    }

    context.strokeStyle = "rgb( 0, 0, 0 )";
    context.strokeRect(0, y0 + yOffset, canvas.width, canvas.height - y0 - yOffset);

    // 主キーとそれ以外の区切り線
    context.beginPath();
    context.moveTo(0, y0 + yOffset + yInterval * partitionCount);
    context.lineTo(canvas.width, y0 + yOffset + yInterval * partitionCount);
    context.stroke();

    return canvas;
}

function getEntityBoardHeight(columnNames) {
    return 8 * (1 + columnNames.length);
}

function createRelation(start, end, startCardinality, endCardinality) {
    var index = 0;
    var geometry = new THREE.Geometry();
    geometry.vertices[index++] = start;
    geometry.vertices[index++] = end;

    var vector = end.clone().sub(start.clone()).multiplyScalar(0.2);
    var orthoVector = vector.x == 0 ? new THREE.Vector3(4, 0, 0) : new THREE.Vector3(0, 4, 0);

    if (startCardinality == "1" || startCardinality == "1M") {
        geometry.vertices[index++] = start.clone().add(vector).sub(orthoVector);
        geometry.vertices[index++] = start.clone().add(vector).add(orthoVector);
        if (startCardinality == "1M") {
            geometry.vertices[index++] = start.clone().sub(orthoVector);
            geometry.vertices[index++] = start.clone().add(vector);
            geometry.vertices[index++] = start.clone().add(orthoVector);
            geometry.vertices[index++] = start.clone().add(vector);
        }
    }
    if (endCardinality == "1" || endCardinality == "1M") {
        geometry.vertices[index++] = end.clone().sub(vector).sub(orthoVector);
        geometry.vertices[index++] = end.clone().sub(vector).add(orthoVector);
        if (endCardinality == "1M") {
            geometry.vertices[index++] = end.clone().sub(orthoVector);
            geometry.vertices[index++] = end.clone().sub(vector);
            geometry.vertices[index++] = end.clone().add(orthoVector);
            geometry.vertices[index++] = end.clone().sub(vector);
        }
    }

    var material = new THREE.LineBasicMaterial({ color: 0x000000 });

    var line = new THREE.LineSegments(geometry, material);
    line.position.set(0, 0, 0);

    return line;
}

function mainloop() {
    view.updateTrackball();
    view.render();

    requestAnimationFrame(mainloop);
}

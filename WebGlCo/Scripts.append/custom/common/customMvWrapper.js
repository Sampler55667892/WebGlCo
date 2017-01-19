//====================================================================================================
// MODEL
//====================================================================================================
var Model = (function () {
    function Model() {
        this.scene = new THREE.Scene();
    }

    Model.prototype.addObject = function (o) {
        this.scene.add(o);
    };

    return Model;
}());

//====================================================================================================
// VIEW
//====================================================================================================
var View = (function () {
    function View( m, canvasFrameName ) {
        this.model = m;
        this.initialize( canvasFrameName );
    }

    View.prototype.setRenderer = function( r ) {
        this.renderer = r;
    };

    View.prototype.updateTrackball = function() {
        this.trackball.update();
    };

    View.prototype.render = function() {
        this.renderer.render( this.model.scene, this.camera );
    };

    // private method �ŏ���������� this.xxx �� undefined �ɂȂ�
    View.prototype.initialize = function ( fn ) {
        this.canvasFrame = document.getElementById( fn );
        this.camera = createCamera( this.canvasFrame );
        this.trackball = createTrackball( this.camera, this.canvasFrame );
    };

    function createCamera( f ) {
        var c = new THREE.PerspectiveCamera( 45, f.clientWidth / f.clientHeight, 1, 10000 );
        c.position.set( 0, 0, 130 );
        c.up.set( 0, 1, 0 );
        c.lookAt({ x: 0, y: 0, z: 0 });
        return c;
    }

    function createTrackball( c, f ) {
        var t = new THREE.TrackballControls( c, f );

        // ��]�̐ݒ�
        t.noRotate = false;
        t.rotateSpeed = 2.0;

        // �g��̐ݒ�
        t.noZoom = false;
        t.zoomSpeed = 1.0;

        // �p���̐ݒ�
        t.noPan = false;
        t.panSpeed = 1.0;
        t.target = new THREE.Vector3( 0, 0, 10 );

        // �X�^�e�B�b�N���[�u�ݒ�
        t.staticMoving = true;

        // �_�C�i�~�b�N���[�u�ݒ�
        t.dynamicDampingFactor = 0.3;

        return t;
    }

    return View;
}());

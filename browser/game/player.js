import store from '../store';
import { scene, camera, canvas, renderer, world, groundMaterial, playerID, myColors } from './main';

const THREE = require('three');
const CANNON = require('../../public/cannon.min.js');
const PlayerControls = require('../../public/PlayerControls');

let controls;

export const Player = function( playerID, isMainPlayer ) {
	this.playerID = playerID;
	this.isMainPlayer = isMainPlayer;
	this.mesh;
	this.cannonMesh;
	var scope = this;


	// create THREE ball
	var ball_geometry = new THREE.TetrahedronGeometry( 10, 2 );
	var ball_material = new THREE.MeshPhongMaterial( {color: myColors["grey"], shading:THREE.FlatShading} );

	// create Cannon box
	if(this.isMainPlayer){
		var sphereShape = new CANNON.Sphere(10);
		scope.cannonMesh = new CANNON.Body({mass: 50, material: groundMaterial, shape: sphereShape});
		scope.cannonMesh.linearDamping = scope.cannonMesh.angularDamping = 0.4;
	}


	this.init = function() {
		let playerData = store.getState().gameState.players[scope.playerID];

		// mesh the ball geom and mat
		scope.mesh = new THREE.Mesh( ball_geometry, ball_material );
		scope.mesh.castShadow = true;

		scope.mesh.position.x = playerData.x;
		scope.mesh.position.y = playerData.y;
		scope.mesh.position.z = playerData.z;
		scope.mesh.rotation.x = playerData.rx;
		scope.mesh.rotation.y = playerData.ry;
		scope.mesh.rotation.z = playerData.rz;

		// should be scope.playerID
		scope.mesh.name = playerID;

		// initially scale player if scale props exist
		if(playerData.scale){
			scope.mesh.scale.x=scope.mesh.scale.y=scope.mesh.scale.z = playerData.scale
		}

		scene.add( scope.mesh );


		// add Cannon box
		if(scope.isMainPlayer){
			scope.cannonMesh.position.x = scope.mesh.position.x;
  			scope.cannonMesh.position.z = scope.mesh.position.y;
  			scope.cannonMesh.position.y = scope.mesh.position.z;
  			scope.cannonMesh.quaternion.x = scope.mesh.quaternion.x;
  			scope.cannonMesh.quaternion.y = scope.mesh.quaternion.y;
  			scope.cannonMesh.quaternion.z = scope.mesh.quaternion.z;
  			scope.cannonMesh.quaternion.w = scope.mesh.quaternion.w;

			world.add(scope.cannonMesh);
		}

		// add controls and camera
		if ( scope.isMainPlayer ) {
			controls = new THREE.PlayerControls( camera, scope.mesh, scope.cannonMesh );
		}
	};

	this.setOrientation = function( position, rotation ) {
		if ( scope.mesh ) {
			scope.mesh.position.copy( position );
			scope.mesh.rotation.x = rotation.x;
			scope.mesh.rotation.y = rotation.y;
			scope.mesh.rotation.z = rotation.z;
		}
	};

	// Kenty: I added this method to get a player's positional data
	this.getPlayerData = function() {
		return {
			x: scope.mesh.position.x,
			y: scope.mesh.position.y,
			z: scope.mesh.position.z,
			rx: scope.mesh.rotation.x,
			ry: scope.mesh.rotation.y,
			rz: scope.mesh.rotation.z,
			scale: scope.mesh.scale.x // y or z would work too
		};
	};
};

export {controls};

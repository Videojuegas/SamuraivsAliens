//-------------------------------------------------------------------------------------------------------------------------
// Simple utiluty script to make object ignore collisions with some list of colliders 
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Ignore collisions with")


var ignoreCollisionWith: Collider[];

//==================================================================================================================================
function Start () 
{
 if(ignoreCollisionWith.Length > 0 && GetComponent.<Collider>())
  for( var i = 0; i< ignoreCollisionWith.Length; i++)
     Physics.IgnoreCollision(GetComponent.<Collider>(), ignoreCollisionWith[i]);

}

//-------------------------------------------------------------------------------------------------------------------------
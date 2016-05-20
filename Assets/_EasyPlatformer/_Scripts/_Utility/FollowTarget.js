//----------------------------------------------------------------------------------------------
// Simple script that allow smooth move towards the target
// It used to allow object follow target smoothly 
// Object always tries to keep initial offset against the target
//----------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Follow player")

var targetTag: String = "Player";   // Find and follow object with this tag
var target : Transform;  			// Object to follow
var smoothY = 3;    	 			// Smoothing parameter. How fast initial offset will be restored


// Important internal values. Please don't change them blindly
private var initialPosition: Vector3;


//===================================================================================================
// Save initial offfset against target
function Start () 
{
  if (!target) target = GameObject.FindGameObjectWithTag(targetTag).transform;
  initialPosition = transform.position - target.position;
  
}

//----------------------------------------------------------------------------------
// Smoothly move the camera towards that target position
function LateUpdate () 
{
   if (target) transform.position = Vector3(target.position.x + initialPosition.x, Mathf.Lerp(transform.position.y, target.position.y + initialPosition.y, Time.deltaTime * smoothY), target.position.z + initialPosition.z); 
}

//----------------------------------------------------------------------------------
// Smoothly move the camera towards that target position
function SetNewTarget (newTarget: Transform) 
{
   target = newTarget;
}
//----------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//  Simple script to process falling platform
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(Rigidbody)
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Falling Platform")


var applicableTags: String[];		// List  of Tags of objects those can affect the platform
var minMass: float;					// Minimal mass of the object to  affect platform
var timeBeforeFall: float;			// Delay before platform will fall

var returnable: boolean = false;	// Will platform try to return to initial position or no
var maxOffset: float;				// Maximal offset of plaform
var speed: float;					// Returning speed


// Important internal variables - please don't change them blindly
private var fallTime: float = Mathf.Infinity;
private var startPosition: Vector3;
private var endPosition: Vector3;
private var inCollision: boolean = false;


//==================================================================================================================================
// Initialize
function Start () 
{ 
   // Add collider if it's missed
   if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
   
  GetComponent.<Rigidbody>().isKinematic = true;
  GetComponent.<Rigidbody>().useGravity = true;
  
  startPosition = transform.localPosition;
  endPosition = startPosition;
  endPosition.y -= maxOffset;
  
}

//-------------------------------------------------------------------------------------------------------------------------
// Process falling or returning
function Update () 
{
  // Process movement
  if (fallTime <= Time.time)
      if (!returnable) GetComponent.<Rigidbody>().isKinematic = false;
        else
          if (!inCollision) transform.localPosition = Vector3.MoveTowards(transform.localPosition, startPosition, speed/4 * Time.deltaTime);
                 else  transform.localPosition = Vector3.MoveTowards(transform.localPosition, endPosition, speed * Time.deltaTime);
}

//-------------------------------------------------------------------------------------------------------------------------	
// Trigger falling  if platform collided with suitable object
function OnCollisionEnter (collision : Collision) 
{ 
  if (startPosition == transform.localPosition)
    {
	  var suitableCollider: Collider;
	  
	   if (applicableTags.Length == 0)  suitableCollider = collision.collider;
		 else
		   for (var applicableTag: String in applicableTags)
		     if (collision.collider.tag == applicableTag)
		   	   {
		   		 suitableCollider = collision.collider;
		         break;
		       }


	    if (suitableCollider  &&  suitableCollider.GetComponent.<Rigidbody>()  &&  suitableCollider.GetComponent.<Rigidbody>().mass > minMass)  fallTime = Time.time + timeBeforeFall;
	}

}

//-------------------------------------------------------------------------------------------------------------------------	
function OnCollisionExit (collision : Collision) 
{ 
  yield WaitForSeconds(1);
  inCollision = false; 
  
}

//-------------------------------------------------------------------------------------------------------------------------	
function OnCollisionStay (collision : Collision) 
{ 
   inCollision = true;
}

//-------------------------------------------------------------------------------------------------------------------------	
// Draw debug visualization
function OnDrawGizmos() 
{
  if (returnable) 
   {
	   Gizmos.color = Color.gray;
	  
	   Gizmos.DrawWireSphere( transform.position, 0.1);
	   Gizmos.DrawWireSphere( Vector3( transform.position.x,  transform.position.y - maxOffset,  transform.position.z), 0.1);
	   Gizmos.DrawLine (  transform.position,   Vector3( transform.position.x,  transform.position.y - maxOffset,  transform.position.z));
   }
          
 }
 
//-------------------------------------------------------------------------------------------------------------------------	
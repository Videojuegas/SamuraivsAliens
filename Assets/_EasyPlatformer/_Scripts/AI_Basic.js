//-------------------------------------------------------------------------------------------------------------------------
//  Basic AI behavior(extends ActorBehavior), allows to control non-flying AI:
// - Navigate across platforms
// - Avoid obstacles and gaps
// - Patrol, Spot, chase and attack player (using ranged and/or meele weapons)
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/AI/Basic AI Behaviour")

public class AI_Basic extends ActorBehavior {}


var heightTolerance: float = 1.5;	// Multiplayer to collider y-size to specify max height betweeen platforms  AI may allow himself to move
var calmDownDelay: float = 5;		// How fast AI will go back to patrol mode after he loses enemy
var hasRangedWeapon: boolean;		// Has AI ranged weapon to use or not
var targetTag: String = "Player";	// Enemy object tag
var viewField: AI_ViewField;		// View field trigger
var blocksVision : LayerMask;		// LayerMask to specify thansparent( for AI view) objects


// Important internal variables - please don't change them blindly
private var startHeightTolerance: float;
private var calmDownTime: float;
private var currentWeapon: int;
private var attack: float;
private var jump: float;
private var switchWeapon: float;
private var move: float;
private var lastSeenPosition: Vector3;


//==================================================================================================================================
// Initialize
function Start () 
{
    super.Start();

	move = 1;
	startHeightTolerance = heightTolerance;
	
	if (viewField)  viewField.targetTag = targetTag;
	 else Debug.LogError("ERROR: viewField object should be assigned to " + gameObject.name);

}

//-------------------------------------------------------------------------------------------------------------------------
// Check actor sensors and update states accordingly 
function Update () 
{
  super.Update();
  
  // Reset states
  switchWeapon = 0;
  attack = 0;
  jump = 0;

 if (objectBelow) 
  {
  // PROCESS ATTACK BEHAVIOR  (if enemy is in viewField) :
   if (viewField.targetInField  ||  objectAhead && objectAhead.tag == targetTag)
    {
       if(viewField.targetInField) lastSeenPosition = viewField.targetInField.GetComponent.<Collider>().bounds.center; 
       
     
          // Increase heightTolerance foe chasing
          heightTolerance = startHeightTolerance * 2; 
          
          // Check is there obstackes to enemy or not
          var  directTarget: boolean = !Physics.Linecast(GetComponent.<Collider>().bounds.center, lastSeenPosition, blocksVision);
          
          // Set calmDownTime
          if (directTarget) calmDownTime = Time.time + calmDownDelay;

         // If enemy  just in front of AI - switch weapon to meele and try to attack
          if (objectAhead && objectAhead.tag == targetTag)
            {
              switchWeapon = -1;
              GetComponent.<Rigidbody>().AddForce(transform.forward * movementSpeed/2, ForceMode.Force);
              attack = 1;
            }
          else  // If enemy far enough and AI has RangedWeapon - switch weapon and try to attack
           if(hasRangedWeapon && directTarget) 
             {
		        move = 0; 
		        attack = 1;
		        switchWeapon = 1;
		           
		        if (transform.position.x < lastSeenPosition.x) newRotation = Quaternion.LookRotation(Vector3.right);  else newRotation = Quaternion.LookRotation(Vector3.left);
		      }
		      else // Don't move  during ranged attack
		          if (Mathf.Abs(transform.position.x - lastSeenPosition.x) < GetComponent.<Collider>().bounds.extents.x)  move = 0;
		             else   if (transform.position.x < lastSeenPosition.x) move = 1; else  move = -1;


        // Back to patrol if enemy have been lost calmDownDelay seconds ago
	    if (calmDownTime < Time.time)
	      {
	        heightTolerance = startHeightTolerance;
	        viewField.targetInField = null;
	        lastSeenPosition = Vector3.zero;
	        switchWeapon = -1;
	        move = 1;
	        
	      }

     }
      else // When in patrol - use only 80% of  movement speed
        move = Mathf.Sign(move) * 0.75; 
     
    // Check if weapon should be switched to another or remains the  same       
    if (switchWeapon != currentWeapon)  currentWeapon = switchWeapon;   else  switchWeapon = 0;
        
        

 // PROCESS MOVEMENT BEHAVIOR (including Navigation across platforms and Obstacles and gaps avoidance):
  	 var currentPlatformLimits: Vector2;  
 	 // Get current platform limits     
	  currentPlatformLimits = Vector2(objectBelow.GetComponent.<Collider>().bounds.center.x - objectBelow.GetComponent.<Collider>().bounds.extents.x*0.85, objectBelow.GetComponent.<Collider>().bounds.center.x + objectBelow.GetComponent.<Collider>().bounds.extents.x*0.85);
     
     // IF AI out of current  platform limits  
     if (transform.position.x < currentPlatformLimits.x  ||  transform.position.x > currentPlatformLimits.y)  
	    {
	      // If there is a platform above and low enough - try to jump on it
	      if (Physics.Raycast (GetComponent.<Collider>().bounds.center + transform.forward, transform.up, raycastHit, GetComponent.<Collider>().bounds.size.y * heightTolerance/2)) jump = 1;
	         else // If there is a below and close enough - jump down on it, else - turn back
	           if (!Physics.Raycast (GetComponent.<Collider>().bounds.center + transform.forward, -transform.up, raycastHit, GetComponent.<Collider>().bounds.size.y * heightTolerance))
	              { 
	                 move = -move;
	                 GetComponent.<Rigidbody>().velocity = Vector2.zero;
	              }
	     }
	    //else
 	    // If there is an low obstacle ahead - try to jump over it, else - turn back
	      if (objectAhead && objectAhead.tag != targetTag ) 
			  if (!Physics.Raycast (GetComponent.<Collider>().bounds.center + Vector3.up * GetComponent.<Collider>().bounds.extents.y, transform.forward, raycastHit, GetComponent.<Collider>().bounds.extents.x * 1.2))  jump = 1;   
			     else 
			      { 
	                 move = -move;
	                 GetComponent.<Rigidbody>().velocity = Vector2.zero;
	              }
   }
   
 // DEBUG VISUALIZATION: Show basic sensors rays and platform limits
	Debug.DrawLine (Vector3(currentPlatformLimits.x, GetComponent.<Collider>().bounds.center.y, 0), Vector3(currentPlatformLimits.y, GetComponent.<Collider>().bounds.center.y, 0),  Color.blue);
	Debug.DrawRay(GetComponent.<Collider>().bounds.center, transform.forward, Color.red);
	Debug.DrawRay(GetComponent.<Collider>().bounds.center + transform.forward, -transform.up * GetComponent.<Collider>().bounds.size.y * heightTolerance, Color.red);    
    if (viewField.targetInField) Debug.DrawLine(GetComponent.<Collider>().bounds.center, viewField.targetInField.GetComponent.<Collider>().bounds.center);
    
}

//-------------------------------------------------------------------------------------------------------------------------
// Return values to behave accordingly to states
function GetInputFor (action: ActorAction): float 
{ 
  if (action.automatic) return 1;
  
  switch (action.type)
    {
	//---------------
     case ActorActionType.Idle:
     break;
     
	//---------------
     case ActorActionType.Move:
      return move;
     break;

	//---------------
     case ActorActionType.Jump:
      return jump;
     break;
     
	//---------------
     case ActorActionType.Attack:
      return attack;
     break;
     
	//---------------
    case ActorActionType.Damage:
    break;
     
	//---------------
     case ActorActionType.Die:
     break;
     
	//---------------
     case ActorActionType.SwitchWeapon:
      return switchWeapon;
     break;
       
	//--------------- 
     case ActorActionType.Push:
     break;
          
    }
     
     
  return 0;
}

//-------------------------------------------------------------------------------------------------------------------------
// Should be called by WeaponManager when it ranged weapon is out of fAmmo
function OutOfAmmo () 
{ 
   hasRangedWeapon = false;
   switchWeapon = -1;
   move = 1;
}

//-------------------------------------------------------------------------------------------------------------------------
// Override parend functions to neglect/change default actions
function Push (inputValue: float): float
{ 
}

//-----------------
function Attack (inputValue: float): float
{ 
   return 1;
}

//-----------------
function Die (inputValue: float): float
{ 
    life = 0;
    Destroy(gameObject, 2);
	return 1;
}

//-------------------------------------------------------------------------------------------------------------------------
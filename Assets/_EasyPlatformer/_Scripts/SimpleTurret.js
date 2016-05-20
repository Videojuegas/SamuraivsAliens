//-------------------------------------------------------------------------------------------------------------------------
// Simple turret controlling script
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/AI/Simple Turret")


var targetTag: String = "Player";	// Enemy object tag
var viewField: AI_ViewField;		// View field trigger
var blocksVision : LayerMask;		// LayerMask to specify thansparent( for AI view) objects
var calmDownDelay: float = 5;		// How fast AI will go back to patrol mode after he loses enemy
var rotationSpeed: float = 5;		// Turret rotation speed


// Important internal variables - please don't change them blindly
 private var calmDownTime: float;
 private var target: Collider;
 private var newRotation: Quaternion;
 
 
//==================================================================================================================================
function Start () 
{
	if (viewField)  viewField.targetTag = targetTag;
	 else Debug.LogError("ERROR: viewField object should be assigned to " + gameObject.name);
	 
	
}

//-------------------------------------------------------------------------------------------------------------------------
function Update () 
{
    // Is enemy in field?
     if (viewField.targetInField  && !target) 
       {
        calmDownTime = Time.time + calmDownDelay;
        target = viewField.targetInField.GetComponent.<Collider>();
 
       }

     if(target)
       {   
          // Check is there obstacles to enemy or not
          var  directTarget: boolean = !Physics.Linecast(transform.position, target.bounds.center, blocksVision);
          
          // Look at target
           if (transform.position.x < target.bounds.center.x) newRotation = Quaternion.LookRotation(Vector3.forward);  else newRotation = Quaternion.LookRotation(Vector3.back);
           if (transform.rotation != newRotation) transform.rotation =  Quaternion.Slerp (transform.rotation, newRotation, Time.deltaTime * rotationSpeed);
		 
		// Try to attack
          if (directTarget) BroadcastMessage("Fire");
     

        // Back to patrol if enemy have been lost calmDownDelay seconds ago
	    if (calmDownTime < Time.time && !directTarget)
	      {
	        viewField.targetInField = null; 
	        target = null; 
	      }
	      
      }
    

   
 // DEBUG VISUALIZATION: Show basic sensor
 if (viewField.targetInField) Debug.DrawLine(transform.position, target.bounds.center, Color.red);
    
}

//-------------------------------------------------------------------------------------------------------------------------
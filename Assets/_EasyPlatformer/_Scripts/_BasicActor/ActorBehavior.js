//-------------------------------------------------------------------------------------------------------------------------
// Main script to process actor actions (movement, etc) and behave accordingly
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(Rigidbody)
@script RequireComponent(Animator)
@script AddComponentMenu ("EasyPlatformer/BasicActor/Actor basic behaviour")


enum ActorActionType {None, Idle, Move, Jump, Attack, Damage, Die, SwitchWeapon, Push}

	 
var life: float = 10;				 // How much damage can be applied to Actor before death (Infinite if 0)
var movementSpeed: float = 25;		 // Movement Speed
var jumpingForce:  float = 25;		 // Jumping Force


// Important internal variables - please don't change them blindly
@HideInInspector	 var newRotation: Quaternion;
@HideInInspector	 var objectBelow: GameObject;
@HideInInspector	 var objectAhead: GameObject;
@HideInInspector	 var secondJump: boolean = false;
@HideInInspector	 var raycastHit : RaycastHit;
@HideInInspector 	 var serviceValue: float;


//==================================================================================================================================
// Initialize
function Start () 
{
	// Add collider if it's missed and Rigidbody if needed
	if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider); 
	  
	transform.rotation = Quaternion.LookRotation(Vector3.right);
	newRotation = transform.rotation;

	if (life <= 0) life = Mathf.Infinity;

}

//-------------------------------------------------------------------------------------------------------------------------
// Check is actor grounded, has something ahead of it
function Update () 
{

	if (transform.rotation != newRotation) transform.rotation =  Quaternion.Slerp (transform.rotation, newRotation, Time.deltaTime * movementSpeed/4);
	if (Physics.Raycast (GetComponent.<Collider>().bounds.center, Vector3.down, raycastHit, GetComponent.<Collider>().bounds.extents.y * 1.2)  &&  !raycastHit.collider.isTrigger)  objectBelow = raycastHit.collider.gameObject;  else  objectBelow = null; 
	if (Physics.Raycast (GetComponent.<Collider>().bounds.center, transform.forward, raycastHit, GetComponent.<Collider>().bounds.extents.x * 1.2)  &&  !raycastHit.collider.isTrigger)  objectAhead = raycastHit.collider.gameObject;  else  objectAhead = null; 
	  
}

//-------------------------------------------------------------------------------------------------------------------------
// Template for GetInputFor action
function GetInputFor (action: ActorAction): float 
{ 
  if (action.automatic) return 1;    else  return 0;
  
}

//-------------------------------------------------------------------------------------------------------------------------
// React on action accordingly to it type and inputValue
function ReactOn (action: ActorAction): float
{ 
  var inputValue: float = GetInputFor(action);
  if (inputValue != 0  && life > 0)
   switch (action.type)
    {
	//---------------
     case ActorActionType.Idle:
     break;
     
	//---------------
     case ActorActionType.Move:
        return Move (inputValue);
     break;

	//---------------
   case ActorActionType.Jump:
       return Jump (inputValue);
     break;
     
	//---------------
     case ActorActionType.Attack:
       return Attack (inputValue);
     break;
     
	//---------------
    case ActorActionType.Damage:
        return Damage(inputValue);
     break;
     
	//---------------
     case ActorActionType.Die:
        return Die(inputValue);
     break;
     
	//---------------
     case ActorActionType.SwitchWeapon:
        return SwitchWeapon(inputValue);
     break;
       
	//--------------- 
     case ActorActionType.Push:
        return Push(inputValue);
     break;
          
    }
   
   return 0;
   
}

//==================================================================================================================================
// LIST OF FUNCTIONS TO PROCESS SPECIFIC ACTOR ACTIONS
//==================================================================================================================================

function ApplyDamage (amount: float) 
{ 
   if (life <= amount)  SendMessage ("PerformActorAnimation", ActorActionType.Die);
     else 
      {
  		serviceValue = amount;
   		SendMessage ("PerformActorAnimation", ActorActionType.Damage);
      }
 
}

function ApplyDamage (damageForce: Vector3) 
{
  // ApplyForce
  GetComponent.<Rigidbody>().AddForce(damageForce, ForceMode.Impulse);

  ApplyDamage(damageForce.magnitude);
  
}
//-------------------------------------------------------------------------------------------------------------------------
function Idle (inputValue: float): float
{ 
  return inputValue;
}

//-------------------------------------------------------------------------------------------------------------------------
function Move (inputValue: float): float
{ 
   if(inputValue >= 0)  newRotation = Quaternion.LookRotation(Vector3.right);  
      else newRotation = Quaternion.LookRotation(Vector3.left);
      
   if (objectBelow) GetComponent.<Rigidbody>().AddForce(Vector3.right * inputValue * movementSpeed, ForceMode.Force); 
      else GetComponent.<Rigidbody>().AddForce(Vector3.right * inputValue * movementSpeed/2, ForceMode.Force);

   return  (Mathf.Abs(GetComponent.<Rigidbody>().velocity.x / movementSpeed * (GetComponent.<Rigidbody>().mass + GetComponent.<Rigidbody>().drag))) ;
}

//-------------------------------------------------------------------------------------------------------------------------
function Jump (inputValue: float): float
{ 
  if (objectBelow || secondJump)
	  {
	    GetComponent.<Rigidbody>().AddForce(Vector3.up * jumpingForce * (-Physics.gravity.y), ForceMode.Force);
	    if (!secondJump) secondJump = true;  else secondJump = false;
	    return 1;
	  }
     else return 0;
}

//-------------------------------------------------------------------------------------------------------------------------
function Attack (inputValue: float): float
{ 
  // rigidbody.AddForce(transform.forward * movementSpeed, ForceMode.Force);
   return 1;

}

//-------------------------------------------------------------------------------------------------------------------------
function Damage (inputValue: float): float
{ 
  life -= serviceValue;
  serviceValue = 0;
  GetComponent.<Rigidbody>().AddForce(-transform.forward * movementSpeed, ForceMode.Force);
  
  return 1; 
  
}

//-------------------------------------------------------------------------------------------------------------------------
function Die (inputValue: float): float
{ 
    life = 0;
	return 1;
}

//-------------------------------------------------------------------------------------------------------------------------
function SwitchWeapon (inputValue: float): float
{ 
   return inputValue;
}

//-------------------------------------------------------------------------------------------------------------------------
function Push (inputValue: float): float
{ 
   if (!objectBelow || !objectAhead) 
	 {
		if (objectAhead) GetComponent.<Rigidbody>().AddForce(-transform.forward * movementSpeed, ForceMode.Force);
		return 0; 
	 }	
	 else
	  return 1;
}

//-------------------------------------------------------------------------------------------------------------------------
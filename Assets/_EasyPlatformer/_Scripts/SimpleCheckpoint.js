//-------------------------------------------------------------------------------------------------------------------------
// Script to handle target object saving and ressurection on checkpoint
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Simple Checkpoint")


var targetTag: String = "Player";	// Tag for target
var activationFx: GameObject;		// Optional link to object with ativation effect 


// Important internal variables - please don't change them blindly
@HideInInspector var targetBackup: GameObject;
static var lastCheckpoint: SimpleCheckpoint;



//==================================================================================================================================
// Initialize
function Start () 
{
  if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
  if (activationFx) activationFx.SetActive(false);
  GetComponent.<Collider>().isTrigger = true;
    
}

//-------------------------------------------------------------------------------------------------------------------------
// Extracts saved targetBackup
function Extract (): GameObject
{
   targetBackup.SetActive(true);
   return targetBackup;
}

//-------------------------------------------------------------------------------------------------------------------------
// Instantiate clone on lastActivated checkpoint
static function ReviveOnLastCheckpoint (): GameObject
{
  if(lastCheckpoint)
   {
      var ghost: GameObject = Instantiate(lastCheckpoint.targetBackup, lastCheckpoint.targetBackup.transform.position, lastCheckpoint.targetBackup.transform.rotation);
      ghost.transform.parent = null;
      ghost.SetActive(true);
   
      return ghost;
    }
   else 
     return null;
     
}


//-------------------------------------------------------------------------------------------------------------------------
// Check is target in trigger and save backup for it (activate current checkpoint)
function OnTriggerEnter (other : Collider) 
{
	if (!other.isTrigger  &&  other.tag == targetTag  &&  !targetBackup) 
	   { 
	     targetBackup = Instantiate(other.gameObject, other.transform.position, other.transform.rotation);
	     targetBackup.SetActive(false);
	     targetBackup.transform.parent = transform;
	     
	     if (lastCheckpoint && lastCheckpoint.activationFx) lastCheckpoint.activationFx.SetActive(false);
	       lastCheckpoint = this;
	     if (activationFx) activationFx.SetActive(true);
	   }
}

//-------------------------------------------------------------------------------------------------------------------------
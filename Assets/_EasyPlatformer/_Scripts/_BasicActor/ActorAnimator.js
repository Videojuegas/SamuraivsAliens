//-------------------------------------------------------------------------------------------------------------------------
// One of the main scripts - processes Actor actions according to Animator parameters and states
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(AudioSource)
@script RequireComponent(Editor_UpdateAnimatorCaptions)
@script AddComponentMenu ("EasyPlatformer/BasicActor/Actor actions animator")


var actorBehavior: ActorBehavior;	// Link to component that contains rules for reaction on actor sates
var actions: ActorAction[];			// List of available actions


 // Important internal variables - please don't change them blindly
private var animator: Animator;
private var actionResult: float;


//==================================================================================================================================
// Initialize
function Start () 
{
    animator = GetComponent("Animator") as Animator;
    for (var action:ActorAction in actions) 
       {
         action.animatorEvent.Initialize(animator);
         if (!action.activatable.receiver) action.activatable.receiver = gameObject;
       }
    
    if (!actorBehavior) actorBehavior  = GetComponent(ActorBehavior);
    
}

//-------------------------------------------------------------------------------------------------------------------------
// Process actions and behaviour reaction on them
function Update () 
{
  for (var action:ActorAction in actions) 
   if (!action.triggeredManually)
    {
       actionResult = actorBehavior.ReactOn(action);
       action.Perform(actionResult);
    }
    else 
      if (action.animatorEvent.IsCurrentState()) action.Perform(0);

}

//-------------------------------------------------------------------------------------------------------------------------
// Manually activate effect (activatable) related to action
function ActivateFX (forAction: String) 
{
  for (var action:ActorAction in actions) 
    if (action.type.ToString() == forAction) action.activatable.Activate(actionResult);
         
}

//-------------------------------------------------------------------------------------------------------------------------
// Trigger action performing manually
function PerformActorAnimation (type: ActorActionType) 
{  
  for (var action: ActorAction in actions) 
    if (action.type == type) 
      {
        action.Perform(actorBehavior.ReactOn(action));
        break;
      }
         
}

//==================================================================================================================================
// Class describes  actor action
class ActorAction
 {

  @HideInInspector	 var caption: String;
  var type: ActorActionType; 		// Action type
  var automatic: boolean;			// Is this action triggered automatically from within Animator and/or Behaviour script
  var triggeredManually: boolean;	// Is ihis action should be triggered manually
  var animatorEvent: AnimatorEvent; // Related AnimatorEvent
  var activatable: Activatable; 	// Additional effect(affecting other components) for the action
  
  
//-------------------------------------------------------------------------------------------------------------------------
 // Perform action
   function Perform (controllerValue: float) 
	{
	   animatorEvent.UpdateParameterBy(controllerValue);
	   if (controllerValue != 0  &&  activatable.forced) activatable.Activate(controllerValue);
	   
	}

 }
 
//==================================================================================================================================
// Class describes additional effect(affecting other components) for actor action
class Activatable
  {
      var receiver: GameObject;			// Receiver game object
  	  var forced: boolean;   			// Should this Activatable triggered automatically from ActorAction
	  var sound:  AudioClip;			// Related sound (will be palyed by Receiver audio component)
	  var particles: ParticleSystem;	// Related particles effect
	  var sendMessage: String;			// Send this custom message to Receiver
	 
	 
  //-------------------------------------------------------------------------------------------------------------------------
  // Perform
	  function Activate (controllerValue: float) 
	   {
	      if (sound && !receiver.GetComponent.<AudioSource>().isPlaying)
	         {
	           receiver.GetComponent.<AudioSource>().clip = sound;
	           receiver.GetComponent.<AudioSource>().Play();
	         }
		  if (particles && !particles.isPlaying)  particles.Play();
		  if (sendMessage != "") receiver.SendMessage(sendMessage, controllerValue, SendMessageOptions.DontRequireReceiver);
		  if (!receiver.activeSelf)  receiver.SetActive(true);
		  
	   }
   
  }

//==================================================================================================================================
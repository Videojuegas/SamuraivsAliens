//-------------------------------------------------------------------------------------------------------------------------
// Script to process general player behaviour like movement, triggering attack etc
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(Editor_UpdatePlayerCaptions)
@script AddComponentMenu ("EasyPlatformer/Player/Player Behaviour")

public class PlayerBehavior extends ActorBehavior {}


var maxfRessurectionsNum: int = 3; // Maximal allowed times of ressurecions
var ressurectionDelay: float = 1;  // Delay till ressurection after death
var playerInput: PlayerInput[];    // Input source


// Important internal variables - please don't change them blindly
private var gameOver: boolean;
static var deathNum: int;
function Start () 
{   
    if (deathNum > maxfRessurectionsNum)
    { 
        life = 10 ;
        gameOver= false;
        deathNum=0;
    }
}
//==================================================================================================================================
// Behave according to playerInput
function GetInputFor (action: ActorAction): float 
{ 
  if (action.automatic) return 1;
  
  if (Input.anyKey  ||  Input.touchCount > 0  ||  Input.GetJoystickNames().Length > 0)
   for (var input:PlayerInput in playerInput)   if (input.relatedAction == action.type)  return input.GetKey();
  
  return 0;
}

//-----------------
function Die (inputValue: float): float
{ 
    life = 0;
    Invoke("Ressurection", ressurectionDelay);
    Destroy(gameObject, ressurectionDelay);
	return 1;
}

//-------------------------------------------------------------------------------------------------------------------------
// Increase life
function Heal (amount: float) 
{ 
  life += amount;
}

//-------------------------------------------------------------------------------------------------------------------------
// Ressurect on last Checkpoint
function Ressurection () 
{ 
  var revived: GameObject;
  
  if (deathNum < maxfRessurectionsNum)   revived = SimpleCheckpoint.ReviveOnLastCheckpoint();
   
    if (revived) 
        {
          Camera.main.GetComponent(FollowTarget).SetNewTarget(revived.transform);
          deathNum++;
          life = 10 ;
        }
        else 
          deathNum = maxfRessurectionsNum + 1;

}

//-------------------------------------------------------------------------------------------------------------------------
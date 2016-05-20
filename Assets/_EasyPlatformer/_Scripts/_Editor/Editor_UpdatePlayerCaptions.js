//-------------------------------------------------------------------------------------------------------------------------
// Simple editor script to update playerBehavior actions caption, to make list of them more obvious
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script ExecuteInEditMode();


var playerBehavior: PlayerBehavior;


//==================================================================================================================================
// Prepare
function OnEnable () 
{
   if (!Application.isPlaying) 
    {
     this.hideFlags = HideFlags.HideInInspector;
     playerBehavior = gameObject.GetComponent(PlayerBehavior) as PlayerBehavior;
    }
   
}

//-------------------------------------------------------------------------------------------------------------------------
// Update captions if action type was changed
function Update()
{
 if (!Application.isPlaying) 
  if (playerBehavior)  
      for (var playerInput:PlayerInput in playerBehavior.playerInput) 
         if (playerInput.caption != playerInput.relatedAction.ToString())  playerInput.caption = playerInput.relatedAction.ToString();
}

//-------------------------------------------------------------------------------------------------------------------------
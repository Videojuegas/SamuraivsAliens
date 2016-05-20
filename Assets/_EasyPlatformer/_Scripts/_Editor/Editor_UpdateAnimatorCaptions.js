//-------------------------------------------------------------------------------------------------------------------------
// Simple editor script to update actorAnimator actions caption, to make list of them more obvious
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script ExecuteInEditMode();

var actorAnimator: ActorAnimator;


//==================================================================================================================================
// Prepare
function OnEnable () 
{
   if (!Application.isPlaying) 
    {
      this.hideFlags = HideFlags.HideInInspector;
      actorAnimator = gameObject.GetComponent(ActorAnimator) as ActorAnimator;
    }
   
}

//-------------------------------------------------------------------------------------------------------------------------
// Update captions if action type was changed
function Update()
{
 if (!Application.isPlaying) 
  if (actorAnimator) 
      for (var action:ActorAction in actorAnimator.actions) 
         if (action.caption != action.type.ToString()) action.caption = action.type.ToString();

}

//-------------------------------------------------------------------------------------------------------------------------
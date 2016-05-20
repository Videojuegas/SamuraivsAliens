//---------------------------------------------------------------------------------------------------------	
// Loads 1st scene when triggered
//---------------------------------------------------------------------------------------------------------	
#pragma strict

var delay: float = 1;
var allowedTag: String = "Player";

//---------------------------------------------------------------------------------------------------------	
// Activator enters trigger - enable hint renderer
function OnTriggerEnter(collider : Collider)
{
  if (collider.tag == allowedTag)
    {
  	  yield WaitForSeconds(delay);
  	  Application.LoadLevel(0);
    }
    
}

//---------------------------------------------------------------------------------------------------------	
//-------------------------------------------------------------------------------------------------------------------------
// Deal damage to object with damageableTags when collided 
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Damage on collision")


var damageValue: int = 1;
var damageableTags: String[];


//==================================================================================================================================
function OnTriggerEnter (other : Collider)
{  

 if (damageableTags.Length == 0) other.gameObject.BroadcastMessage("ApplyDamage", damageValue, SendMessageOptions.DontRequireReceiver);
  else
   for (var applicableTag: String in damageableTags)
     if (other.tag  == applicableTag)
       {
         other.gameObject.BroadcastMessage("ApplyDamage", damageValue, SendMessageOptions.DontRequireReceiver);
         break;
       }
   
}

//==================================================================================================================================
function OnCollisionEnter(collision : Collision) 
{ 
   OnTriggerEnter(collision.collider);
   
}

//-------------------------------------------------------------------------------------------------------------------------
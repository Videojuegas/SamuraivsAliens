//------------------------------------------------------------------------------------------------------------------------
// Script allows to manage several weapons (mount them, switch beetween the, etc)
//------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/SimpleWeapons/Weapons Manager")

var customEmitter: Transform;	// Bullets and raycasts origin/direction
var mountPoint: Transform;		// Mount-point for allweapons origins
var animatorParameter: String;  // Name of Mecanim parameterthat controls SwitchWeapon state
var weapons: SimpleWeapon[];	// List of weapons prefabs


// Important internal variables - please don't change them blindly
private var currentWeapon: int;
private var animatorParameterHash : int;
private var animator: Animator;


//==================================================================================================================================
// Create wweapons from prefabs and  mount them
function Start () 
{
  if (!mountPoint) mountPoint = transform;
  if (!customEmitter) customEmitter = transform;
  
  for (var i=0; i < weapons.Length; i++)
	 if (weapons[i]) 
	   {
	     if(weapons[i].carrier != gameObject)
	      {
	    	weapons[i] = Instantiate(weapons[i]);
	     	weapons[i].gameObject.transform.parent = mountPoint.transform;
	    	weapons[i].transform.localPosition = Vector3.zero;
	    	weapons[i].transform.localRotation.eulerAngles = Vector3.zero;
	      }
	      
	     weapons[i].gameObject.SetActive(false);
	     weapons[i].carrier = gameObject;
	     if (!weapons[i].emitter) weapons[i].emitter = customEmitter;
	   }

   SwitchToWeapon(currentWeapon);
   
   animatorParameterHash = Animator.StringToHash(animatorParameter);
   animator = GetComponent("Animator") as Animator;
   
}

//------------------------------------------------------------------------------------------------------------------------
// Switch weapon to next/previous
function SwitchWeapon (switchDirection: int) 
{
  if (switchDirection != 0)
    {
	  weapons[currentWeapon].gameObject.SetActive(false);
	   currentWeapon = Mathf.Clamp(currentWeapon + switchDirection, 0, weapons.Length - 1);
	  weapons[currentWeapon].gameObject.SetActive(true);
	  
	  if (animator) animator.SetInteger(animatorParameterHash, currentWeapon);
    }
    
}

//------------------------------------------------------------------------------------------------------------------------
// Switch to weapon withID
function SwitchToWeapon (id: int) 
{
  if (id >= 0  &&  id < weapons.Length)
    {
	  weapons[currentWeapon].gameObject.SetActive(false);
	  currentWeapon = id;
	  weapons[currentWeapon].gameObject.SetActive(true);
	  if (animator) animator.SetInteger(animatorParameterHash, currentWeapon);
    }
    
}


//------------------------------------------------------------------------------------------------------------------------
// Shoot from current weapon
function Attack () 
{
  weapons[currentWeapon].Fire();

}

//---------------------------------------------------------------------------------------------------------	
// Add ammo for weapon with specified index weapons list
function RefillAmmo (weaponId: int) 
{
  if (weaponId < 0) weapons[currentWeapon].AddAmmoPack();
    else weapons[Mathf.Clamp(weaponId, 0, weapons.Length - 1)].AddAmmoPack();
  
  }
  
 
//------------------------------------------------------------------------------------------------------------------------
// Add new weapon to weapons list
function AddWeapon(newWeapon: SimpleWeapon)
{
  var array = new Array (weapons);
  array.length++;   
  weapons = array.ToBuiltin(SimpleWeapon) as SimpleWeapon[];
  
  weapons[weapons.Length - 1] = Instantiate(newWeapon, mountPoint.transform.position, mountPoint.transform.rotation);
  weapons[weapons.Length - 1].gameObject.transform.parent = mountPoint.transform;
  weapons[weapons.Length - 1].gameObject.SetActive(false);
  
}

//------------------------------------------------------------------------------------------------------------------------
// Returns ID of current weapon
function GetCurrentWeaponID (): int
{
  return currentWeapon;
}

//------------------------------------------------------------------------------------------------------------------------
// Returns ammo amount of current weapon
function GetCurrentWeaponAmmo (): int
{
  return weapons[currentWeapon].ammo;
}

//------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------	
// Simple demo-script to process some interacw elements
//---------------------------------------------------------------------------------------------------------	
#pragma strict


var buttonPause: GUITexture;
var iconCurrentWeapon: GUITexture;
var lifes: GUIText; 
var ammo: GUIText;
var weaponsIcons: Texture[];
var gameOver: GameObject;


var pauseMenu: MenuWindow;
var playerBehavior: PlayerBehavior;
var weaponManager: SimpleWeapon_Manager;


//==================================================================================================================================
// Init
function Start () 
{
   if (!playerBehavior) playerBehavior = GetComponent(PlayerBehavior);
   if (!weaponManager) weaponManager = GetComponent(SimpleWeapon_Manager);
   if (gameOver) gameOver.SetActive(false); 
}


//---------------------------------------------------------------------------------------------------------	
// Process HUD
function Update () 
{
  if (playerBehavior.deathNum > playerBehavior.maxfRessurectionsNum)
    { 
      if (gameOver) gameOver.SetActive(true);
      
    }
     
  var currentWeapon: int = weaponManager.GetCurrentWeaponID();
  if (iconCurrentWeapon && weaponsIcons[currentWeapon]) iconCurrentWeapon.texture = weaponsIcons[currentWeapon];
  
  if (pauseMenu && Input.GetKeyDown(KeyCode.Mouse0) && buttonPause.HitTest(Input.mousePosition)) pauseMenu.enabled = !pauseMenu.enabled;
  var lives:int = playerBehavior.maxfRessurectionsNum -playerBehavior.deathNum;
  lifes.text = "armo : " + playerBehavior.life.ToString()+ " lives:" +lives.ToString();
  
  var currentWeaponAmmo: int = weaponManager.GetCurrentWeaponAmmo();
  if (currentWeaponAmmo >= 0  &&  currentWeaponAmmo < 9999999) 
    {
      ammo.enabled = true;
      ammo.text = "AMMO : " + currentWeaponAmmo.ToString();
    }
   else ammo.enabled = false;
   
}

//---------------------------------------------------------------------------------------------------------	
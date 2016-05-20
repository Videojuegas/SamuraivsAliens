//-------------------------------------------------------------------------------------------------------------------------
// Script  processes  Player input from keyboard, mouse or touch-buttons
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict


//==================================================================================================================================	
// Service class to process button-pressing input from keyboard, mouse, touch-buttons
class PlayerInput
{
  @HideInInspector	 var caption: String;  	// Caption to identify it easily
  var relatedAction: ActorActionType;	    // PlayerAction this input supposed to trigger
  
  var keyboard: InputKey;   				// keyboard key as trigger
  var gamepad: InputKey;     				// gamepad key as trigger
  var mouse: InputKey;       				// mouse key as trigger
  var touch: InputTouch;					// TouchButton as trigger
  var inputAxis: String;					// Use Unity input manager axis
  
  var allowHold: boolean;					// Allow key holding (otherwise it will be processed only once when presseddown)
  
  
//-------------------------------------------------------------------------------------------------------------------------
// Check data fom all input source
 function GetKey (): float 
	 {	
	    // Get button input from keyboard, gamepad, mouse or touch 
	    var inputFromAxis: float;
	    if (inputAxis != "") inputFromAxis = Mathf.CeilToInt(Input.GetAxis(inputAxis));

	    return Mathf.Clamp((keyboard.GetKey(allowHold) + gamepad.GetKey(allowHold) + mouse.GetKey(allowHold) + touch.GetTouch(allowHold) + inputFromAxis), -1.0f, 1.0f);
	    
	 }
	 
//-------------------------------------------------------------------------------------------------------------------------
// Returns if at least one input source is assigned
	 function IsAssigned (): boolean 
	  {	
	    return (keyboard.IsAssigned() || gamepad.IsAssigned() || mouse.IsAssigned() || touch || (inputAxis != ""));
 
	      
	  }
	  	
}

 
//==================================================================================================================================
// Simple class to check keys state
class InputKey
 {
	  var positiveKey: KeyCode;
	  var negativeKey: KeyCode;
	  
//-------------------------------------------------------------------------------------------------------------------------  
// Check/return data from keys
	 function GetKey (allowHold: boolean): int 
	  {	
	    var input: int = 0;
	    
	   #if UNITY_IPHONE || UNITY_ANDROID || UNITY_WP8 || UNITY_BLACKBERRY
	    if (positiveKey != KeyCode.Mouse0  &&  negativeKey != KeyCode.Mouse0 ) 
	   #endif
	    if(allowHold)
	      {
	        if (positiveKey != KeyCode.None && Input.GetKey (positiveKey)) input = 1;
	        if (negativeKey != KeyCode.None && Input.GetKey (negativeKey)) input += -1;
	      } 
	       else
		     {
		      if (positiveKey != KeyCode.None && Input.GetKeyDown (positiveKey)) input = 1;
		      if (negativeKey != KeyCode.None && Input.GetKeyDown (negativeKey)) input += -1;
		     }  
		     
	    return input;
	    
	  }
	  
//-------------------------------------------------------------------------------------------------------------------------
// Returns if at least one key is assigned
	 function IsAssigned (): boolean 
	  {	
	    return (positiveKey != KeyCode.None  || negativeKey != KeyCode.None);
	  }
	  
 }


//==================================================================================================================================
// Simple class to check touch-button state
class InputTouch
{
 
var positiveButton: GUITexture;
var negativeButton: GUITexture;


//-------------------------------------------------------------------------------------------------------------------------
// Hide Gui if project is not mobile
function Start () 
{
	// Deactivate for non-touch devices
	#if !UNITY_IPHONE || !UNITY_ANDROID || !UNITY_WP8 || !UNITY_BLACKBERRY
	   positiveButton.gameObject.SetActive(false);
	   negativeButton.gameObject.SetActive(false);
	#endif
	 
}

//-------------------------------------------------------------------------------------------------------------------------
// Check/return data from touch-buttons
function GetTouch (allowHold: boolean): int 
{
   #if UNITY_IPHONE || UNITY_ANDROID || UNITY_WP8 || UNITY_BLACKBERRY
    var touch: Touch;
    
	for (var i = 0; i < Input.touchCount; ++i) 
		 {
		    touch = Input.GetTouch(i);
		    
			if ( touch.phase == TouchPhase.Began || (allowHold  &&  (touch.phase == TouchPhase.Stationary  ||  touch.phase == TouchPhase.Moved)) )  
			  if (positiveButton && positiveButton.HitTest(touch.position))  return 1;
			    else
			       if (negativeButton && negativeButton.HitTest(touch.position))  return -1;
			
		}
	 #endif	
	
	return 0;
}

//-------------------------------------------------------------------------------------------------------------------------
// Returns if at least one touch-button is assigned
	 function IsAssigned (): boolean 
	  {	
	    return (positiveButton  || negativeButton);
	    
	  }
	  
//-------------------------------------------------------------------------------------------------------------------------
}
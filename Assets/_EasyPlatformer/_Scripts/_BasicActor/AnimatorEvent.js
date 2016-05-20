//-------------------------------------------------------------------------------------------------------------------------
// Script allows to eadily set/get/reset animator parameter to trigger related animator states
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict


class AnimatorEvent
{
  // Parameters types
  public enum ParameterType {trigger, float, int, bool}
  
  
  var layer: int;							// Animator layer of affected state
  var animatorParameter: String;			// Parameter name
  var animatorParameterType: ParameterType; // Parameter type


  // Important internal variables - please don't change them blindly
  private var animatorParameterHash : int;
  private var animator : Animator;
  
  
//================================================================================================================================== 
// Initialize
 function Initialize(anim : Animator)
   {
      animatorParameterHash = Animator.StringToHash(animatorParameter);
      animator = anim;
      
   } 
   
 //-------------------------------------------------------------------------------------------------------------------------
function GetAnimator (): Animator
  {
	return animator;
  }  
  
//-------------------------------------------------------------------------------------------------------------------------
function GetNameHash (): int
  {
	return animatorParameterHash;
  }  
  
//-------------------------------------------------------------------------------------------------------------------------
function IsCurrentState (): boolean
  {
	return (animator.GetCurrentAnimatorStateInfo(layer).IsName(animatorParameter));
  }  
    
//-------------------------------------------------------------------------------------------------------------------------
function SetParameter(val)
 {
    switch (animatorParameterType)
     {
       case ParameterType.float: 
          animator.SetFloat(animatorParameterHash, val);
       break;
        
       case ParameterType.int: 
          animator.SetInteger(animatorParameterHash, val);
       break;
       
       
       case ParameterType.bool: 
          animator.SetBool(animatorParameterHash, val);
       break;
       
       
       case ParameterType.trigger: 
          animator.SetTrigger(animatorParameterHash);
       break;   
               
     }
     
 } 
   
//-------------------------------------------------------------------------------------------------------------------------  
function GetParameter(): Object
 {
    switch (animatorParameterType)
     {
       case ParameterType.float: 
          return animator.GetInteger(animatorParameterHash);
       break;
       
       case ParameterType.int: 
          return animator.GetFloat(animatorParameterHash);
       break;
       
       case ParameterType.bool: 
          return animator.GetBool(animatorParameterHash);
       break;   
       
       case ParameterType.trigger: 
          return animator.GetBool(animatorParameterHash);
       break;   
               
     }
     
     return null;   
 } 
 
//-------------------------------------------------------------------------------------------------------------------------
 function ResetParameter()
  {
    switch (animatorParameterType)
     {
       case ParameterType.float: 
          animator.SetFloat(animatorParameterHash, 0);
       break;
        
       case ParameterType.int: 
          animator.SetInteger(animatorParameterHash, 0);
       break;
       
       
       case ParameterType.bool: 
       case ParameterType.trigger: 
          animator.ResetTrigger(animatorParameterHash);
       break;   
               
     }
     
 }
 
//-------------------------------------------------------------------------------------------------------------------------  
function UpdateParameterBy(condition: float)
  {
     if (condition != 0 ) SetParameter(condition);  else  ResetParameter();
       
  }
  
//------------------------------------------------------------------------------------------------------------------------- 

}
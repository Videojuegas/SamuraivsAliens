using UnityEngine;
using System.Collections;

public class script_boton_pausa : MonoBehaviour {

	public GameObject canvas_menu_pausa;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
		
	public void Presionar_pausa(){
		Time.timeScale = 0.0f;
		canvas_menu_pausa.SetActive (true);
		//GameObject.Find ("Canvas_juego").SetActive (false);
	}
}

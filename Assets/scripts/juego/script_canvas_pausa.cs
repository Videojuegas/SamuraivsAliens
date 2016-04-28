using UnityEngine;
using System.Collections;

public class script_canvas_pausa : MonoBehaviour {

	public bool audio_activado = true;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void Volver_al_juego(){
		Time.timeScale = 1;
		this.gameObject.SetActive (false);
	}

	public void Reiniciar_nivel(){
		Time.timeScale = 1;
		this.gameObject.SetActive (false);
		Application.LoadLevel ("nuevo_juego");
	}

	public void Salir_al_menu_principal(){
		Time.timeScale = 1;
		this.gameObject.SetActive (false);
		Application.LoadLevel ("menu_principal");
	}

	public void Modificar_audios(){
		if (audio_activado) {
			AudioListener.volume = 0;
			audio_activado = false;
		}
		else{
			AudioListener.volume = 1;
			audio_activado = true;
		}
	}
}

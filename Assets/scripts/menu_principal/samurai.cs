using UnityEngine;
using System.Collections;

public class samurai : MonoBehaviour {

	public float speed = 10f;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Vector3 vel = Random.insideUnitCircle * speed;
		//vel.y = 0.0f;
		//vel.x = 0.0f;
		transform.Translate ( vel * Time.deltaTime);
	}
}

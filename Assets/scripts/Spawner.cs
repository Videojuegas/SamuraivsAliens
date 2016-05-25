using UnityEngine;
using System.Collections;

public class Spawner : MonoBehaviour
{
    public GameObject prefab;
    public float timeForSpawn;
    float windowTime;
    // Use this for initialization
    void Start()
    {
        windowTime = 0;
    }

    // Update is called once per frame
    void Update()
    {

        if (Time.time > windowTime)
        {
            windowTime = Time.time + timeForSpawn;
            Instantiate(prefab, transform.position, Quaternion.identity);
        }
    }
}

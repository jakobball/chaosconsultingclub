import requests

url = "https://fynnschneider.app.n8n.cloud/webhook-test/39cd7ada-2069-43bb-9fd5-163f3d668baa"


def get_matching_profiles(projectName: str, query: str):

    data = {    
        "query":  f"Projekt:{projectName}, Zusatz:{query}",
        "sessionId": 1 #for memory
    }
    print(data)

    # Optional: Header setzen (empfohlen)
    headers = {
        "Content-Type": "application/json"
    }

    # Anfrage senden
    response = requests.post(url, json=data, headers=headers)

    return response

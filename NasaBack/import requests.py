import requests
from base64 import b64encode
from getpass import getpass
from requests.auth import HTTPBasicAuth
import os

# Earthdata Login URL for obtaining the token, and creating one if it doesn't exist
url = 'https://urs.earthdata.nasa.gov/api/users/find_or_create_token'

# Earthdata Login credential prompts
prompts = ['Enter NASA Earthdata Login Username \n(or create an account at urs.earthdata.nasa.gov): ',
           'Enter NASA Earthdata Login Password: ']

# Get credentials from user input
username = getpass(prompt=prompts[0])
password = getpass(prompt=prompts[1])

# Prefer requests' built-in Basic Auth (more robust than manually building the header)
headers = {
    'User-Agent': 'edl-token-script/1.0',
    'Accept': 'application/json'
}

# Make the POST request to get the token using HTTP Basic Auth
response = requests.post(url, auth=HTTPBasicAuth(username, password), headers=headers)

# Debug output to help diagnose invalid_credentials errors
print(f"Request sent to: {response.request.method} {response.request.url}")
print("Request headers:", response.request.headers)
print("Response status:", response.status_code)
print("Response headers:", response.headers)
print("Response body:", response.text)

if response.status_code == 200:
    # Parse the response JSON to get the token
    token_info = response.json()
    token = token_info.get("access_token")
    if token:
        print("Token retrieved successfully")

        # Define the path for the .edl_token file in the home directory
        token_file_path = os.path.join(os.path.expanduser("~"), ".edl_token")

        # Write the token to the .edl_token file
        with open(token_file_path, 'w') as token_file:
            token_file.write(token)

        print(f"Token saved to {token_file_path}")
    else:
        print("Received 200 but no access_token found in response JSON")
else:
    print("Failed to retrieve token. Possible causes: invalid credentials, account not activated, or endpoint requires different request format.")
    print("See above response body for details.")
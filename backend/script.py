import requests

# API endpoint to fetch poems
source_url = "https://poetrydb.org/author/Oscar%20Wilde/author,title,linecount,lines"

# API endpoint to send poems to your backend
target_url = "http://localhost:8080/api/poems"

# Fetch data from the PoetryDB API
response = requests.get(source_url)

if response.status_code == 200:
    poems = response.json()  # Parse JSON response
    
    # Process only the first 10 results
    for poem in poems[:10]:
        line_count = int(poem["linecount"])  # Convert linecount to integer

        # Check if the line count is less than 100
        if line_count < 100:
            # Prepare the payload for the POST request
            poem_doc = {
                "title": poem["title"],
                "content": "\n".join(poem["lines"]),  # Combine lines into a single string
                "authorId": poem["author"],  # Use the author name
                "createdAt": None,  # Add timestamp if needed
                "updatedAt": None,
                "isDeleted": False,
                "tags": [],  # Optionally add tags
                "likes": 0,
                "shares": 0,
                "views": 0,
                "commentsCount": 0,
                "relatedPoemIds": []  # Add related poem IDs if applicable
            }

            try:
                # Send the POST request to your API
                post_response = requests.post(target_url, json=poem_doc)

                if post_response.status_code == 201:  # Assuming 201 Created
                    print(f"Successfully added poem: {poem['title']}")
                else:
                    print(f"Failed to add poem: {poem['title']} - {post_response.status_code}: {post_response.text}")

            except requests.exceptions.RequestException as e:
                print(f"Error while sending poem '{poem['title']}': {e}")
        else:
            print(f"Skipped poem: {poem['title']} - Line count is {line_count}")

else:
    print(f"Failed to fetch data. Status code: {response.status_code}")

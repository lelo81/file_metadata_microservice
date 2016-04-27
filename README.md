FreeCodeCamp API Basejump: URL Shortener Microservice
User stories:

I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
When I visit that shortened URL, it will redirect me to my original link.
Example creation usage:
https://url-shortener-microservice-lelo81.c9users.io/new/https://www.google.com
https://url-shortener-microservice-lelo81.c9users.io/new/http://foo.com:80
Example creation output
{ "original_url":"http://foo.com:80", "short_url":"https://url-shortener-microservice-lelo81.c9users.io/8170" }
Usage:
https://url-shortener-microservice-lelo81.c9users.io/2871
Will redirect to:
https://www.google.com/
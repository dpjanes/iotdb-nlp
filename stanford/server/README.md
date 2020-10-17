# Server

This is a simple REST/JSON server front end to the Stanford NLP stuff.
This code in this folder follows the Stanford licensing.

## HOWTO

Note that I'm not really a Java guy. The code is solid, but there's
no Gradle or Maven or any of that other framework stuff here. 

### Installation

You need to have a modern Java installed on your computer.
Then just do

    sh DoInstall

Most of the downloaded files will go in `../contrib`o

### Running

To run locally, for testing

    sh DoRun

It responds to GET and POST, so for example

    curl "http://media.local:18081/entities?document=My+Name+is+Fred+Smith+and+I+live+in+London,+Ontario"
    {
      "delta": 0.011,
      "items": [
        {
          "begin": 16,
          "document": "Smith",
          "end": 21,
          "score": 0.8121054261060908,
          "tag": "PERSON",
          "token": "entity"
        },
        {
          "begin": 36,
          "document": "London",
          "end": 42,
          "score": 0.9966959414574724,
          "tag": "LOCATION",
          "token": "entity"
        },
        {
          "begin": 44,
          "document": "Ontario",
          "end": 51,
          "score": 0.8270727690781802,
          "tag": "LOCATION",
          "token": "entity"
        }
      ]
    }

To adapt it to your needs, just copy `cfg.json`
somewhere else and modify. Then

    sh DoRun --cfg <yourcfg>.json

### Security

By default, it's open - anyone who can reach the URL can use it.

It has optional token based security, which you enable by adding
`tokens` (as a an Array of String) to the configuration.

You can then specify the token by either adding `?token=<token>`
to the URL or adding `Authentication: Bearer <token>` to the
request headers.

If you use token based security, make sure to put NGINX or similar
in front of the server using HTTPS, otherwise your tokens are 
likely to be compromised. 

## Services

For HTTP GET, you can use `document` and (optionally) `language`
in the query string.

For HTTP POST, you use use `document` and (optionally) `language`
in the JSON request.

### Part-of-Speech Tagging
    
Send the request to `/pos`. The response looks like this:

    {
      "delta": 0.052,
      "items": [
        {
          "score": 0.99,
          "document": "The",
          "end": 3,
          "tag": "DT",
          "begin": 0,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "Sign",
          "end": 8,
          "tag": "VB",
          "begin": 4,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "of",
          "end": 11,
          "tag": "IN",
          "begin": 9,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "the",
          "end": 15,
          "tag": "DT",
          "begin": 12,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "Four",
          "end": 20,
          "tag": "CD",
          "begin": 16,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "Chapter",
          "end": 29,
          "tag": "NN",
          "begin": 22,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "I",
          "end": 31,
          "tag": "PRP",
          "begin": 30,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": ".",
          "end": 32,
          "tag": ".",
          "begin": 31,
          "token": "pos"
        },
        ...
        {
          "score": 0.99,
          "document": "upon",
          "end": 1859,
          "tag": "IN",
          "begin": 1855,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "it",
          "end": 1862,
          "tag": "PRP",
          "begin": 1860,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": ".",
          "end": 1863,
          "tag": ".",
          "begin": 1862,
          "token": "pos"
        },
        {
          "score": 0.99,
          "document": "”",
          "end": 1864,
          "tag": "''",
          "begin": 1863,
          "token": "pos"
        }
      ]
    }


### Entity Tagging

Send the request to `/entities`. The response looks like this:

    {
      "delta": 0.056,
      "items": [
        {
          "score": 0.9959663990504976,
          "document": "Sherlock",
          "end": 68,
          "tag": "PERSON",
          "begin": 60,
          "token": "entity"
        },
        {
          "score": 0.9991374208337224,
          "document": "Holmes",
          "end": 75,
          "tag": "PERSON",
          "begin": 69,
          "token": "entity"
        },
        {
          "score": 0.8807182454562008,
          "document": "Beaune",
          "end": 1330,
          "tag": "LOCATION",
          "begin": 1324,
          "token": "entity"
        }
      ]
    }



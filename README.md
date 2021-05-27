# shadow-traffic-example

This is the accompanying example project for a Futurice blog post: (TODO:)

The point is to demonstrate two concepts in Nodejs:

1. Shadow traffic – `main` branch
2. Canary traffic – `canary` branch (see [the branch](TODO:) for more details)

This demonstration happens on the application layer, as the example contains no load balancers or network traffic. Not to say that this is the way to accomplish shadow traffic or canary traffic, but to show how it's possible. The blog post highlights some reasons why you might find this useful. Note how the whole thing can be implemented or taken out inside a single function, without needing to do larger changes in the code base.

## Installation

You need [Nodejs and `npm`](https://nodejs.org/en/download/).

```bash
# Clone this repository
git clone git@github.com:anttispitkanen/shadow-traffic-example.git

# Change into the repository
cd shadow-traffic-example

# Install dependencies
npm install
```

## Shadow traffic?

In this context [shadow traffic, or traffic shadowing](https://www.getambassador.io/docs/edge-stack/latest/topics/using/shadowing/), means duplicating the production traffic of a service or an endpoint to a secondary destination, without it affecting the normal data flow. There are several reasons for why this might be interesting, but mainly:

- Exposing a service or API to real production load before the production actually depends on it
- Performance testing a newer version of a service against the current version by routing the traffic to both in parallel

![Shadow traffic architecture diagram](/docs/Sidechannel.png 'Shadow traffic architecture diagram')

_An example of what the request flow could look like on high level._

```bash
# Start the app on localhost:3000
npm run start:shadow-traffic-enabled # or "npm run start:shadow-traffic-disabled"
```

The shadow traffic mode is now running:

```bash
Server running on http://localhost:3000
```

_(If you want to try the canary traffic instead, run `git checkout canary` and check the README file.)_

Open a new terminal window/tab and make a request:

```bash
curl 'localhost:3000/some-data?animal=dog'
# or
curl 'localhost:3000/some-data?animal=cat'
```

...and you should get a response along the lines of:

```bash
{"data":{"species":"dog","name":"Teppo","dataQuality":"Haven't seen Teppo in a long time so can't be sure ¯\\_(ツ)_/¯"}}
# or
{"data":{"species":"cat","name":"Maisa","dataQuality":"Old, not that fancy."}}
```

Meanwhile, the server logs (in the tab where you ran `npm run start:<something>`) should look something like:

```bash
requestId: d289e0e9-3a10-4e7b-96a7-16be5ffaa522 – START: Requesting animal dog from New Data API
requestId: d289e0e9-3a10-4e7b-96a7-16be5ffaa522 – START: Requesting animal dog from Old Data API
requestId: d289e0e9-3a10-4e7b-96a7-16be5ffaa522 – REPORT: Getting animal dog took 251.5889260172844 ms from New Data API
requestId: d289e0e9-3a10-4e7b-96a7-16be5ffaa522 – REPORT: Getting animal dog took 4302.821949958801 ms from Old Data API

# or

requestId: 982b635a-583a-4c78-868b-dfae9df65c99 – START: Requesting animal cat from New Data API
requestId: 982b635a-583a-4c78-868b-dfae9df65c99 – START: Requesting animal cat from Old Data API
requestId: 982b635a-583a-4c78-868b-dfae9df65c99 – REPORT: Getting animal cat took 1349.8211219906807 ms from New Data API
requestId: 982b635a-583a-4c78-868b-dfae9df65c99 – REPORT: Getting animal cat took 3541.137184023857 ms from Old Data API
```

Note that the requestId values will be different, as well as the duration values.

## Pawesome! 🐕🐈

The example data is about my sister's dog Touko, or Teppo as I like to call him, and my parents' cat Maisa. Both magnificent animals. 🐕 🐈

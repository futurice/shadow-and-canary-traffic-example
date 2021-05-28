# shadow-and-canary-traffic-example

_This is the accompanying example project for a Futurice blog post: (TODO:)_

The point is to demonstrate two concepts in Nodejs: shadow traffic and canary traffic.

This demonstration happens on the application layer, as the example contains no load balancers or network traffic. Not to say that this is the way to accomplish shadow traffic or canary traffic, but to show how it's possible. The blog post highlights some reasons why you might find this useful. Note how the whole thing can be implemented or taken out inside a single function, without needing to do larger changes in the code base.

Also note that while shadow traffic and canary traffic are alternative solutions to the same problem space, they can be happily used together.

## Shadow traffic?

In this context [shadow traffic, or traffic shadowing](https://www.getambassador.io/docs/edge-stack/latest/topics/using/shadowing/), means duplicating the production traffic of a service or an endpoint to a secondary destination, without it affecting the normal data flow. There are several reasons for why this might be interesting, but mainly:

- Exposing a service or API to real production load before the production actually depends on it
- Performance testing a newer version of a service against the current version by routing the traffic to both in parallel

![Shadow traffic architecture diagram](/docs/Sidechannel.png 'Shadow traffic architecture diagram')

_An example of what the request flow could look like on high level._

## Canary traffic?

[Canary deployment, or canary traffic](https://wa.aws.amazon.com/wellarchitected/2020-07-02T19-33-23/wat.concept.canary-deployment.en.html), refers in this case to the ability to redirect traffic from one service to another little by little, increasing the amount in a controlled manner, as opposed to "flipping a switch" and redirecting 100 % of traffic at once. This is especially useful for careful deployments. Say you have a new service that has a bug in it. It's much better to catch this bug when only 5 % of your traffic is subject to it, leading to 5 % of your users experiencing the bug, compared to 100 % of your users suffering from it.

Usually canary is implemented on the infrastructure layer with a load balancer handling the traffic distribution, but here we implement it on the application layer.

![Canary traffic architecture diagram](/docs/Canary.png 'Canary traffic architecture diagram')

_An example of what canary traffic can look like on high level. X + Y = 100 %, and X is going down while Y is going up._

## Test it yourself!

The point of this repo is for you to be able to test this in practice and make changes as you wish.

### Installation (one time)

You need [Nodejs and `npm`](https://nodejs.org/en/download/).

```bash
# Clone this repository
git clone git@github.com:anttispitkanen/shadow-traffic-example.git

# Change into the repository
cd shadow-traffic-example

# Install dependencies
npm install
```

### Running the app and using it

Start the app with:

```bash
npm run start # runs "SHADOW_TRAFFIC_ENABLED=true CANARY_THRESHOLD_PERCENT=50 ts-node ./src/index.ts"
```

You can see that the default script sets shadow traffic enabled and distributes the canary traffic 50-50. Feel free to edit the values in the script and see what happens.

The app is now running:

```bash
Server running on http://localhost:3000
```

For the sake of example, there's one endpoint (`/someData`) that determines the used strategy based on a query parameter passed along with the request. In reality the whole strategy should require no changes to the client, nor even be visible to the client. However, this makes the differences easy to demonstrate and test.

### Testing shadow traffic

Open a new terminal window/tab and make a request:

```bash
curl 'http://localhost:3000/someData?trafficStrategy=shadow&animal=dog'
# or
curl 'http://localhost:3000/someData?trafficStrategy=shadow&animal=cat'
```

...and you should get a response along the lines of:

```bash
{"data":{"species":"dog","name":"Teppo","dataQuality":"Haven't seen Teppo in a long time so can't be sure ¯\\_(ツ)_/¯"}}
# or
{"data":{"species":"cat","name":"Maisa","dataQuality":"Old, not that fancy."}}
```

Meanwhile, the server logs (in the tab where you ran `npm run start`) should look something like:

```bash
requestId: 73125a6c-e866-4029-95a9-d0d6dc0ee4d7 – SHADOW
requestId: 73125a6c-e866-4029-95a9-d0d6dc0ee4d7 – START: Requesting animal dog from New Data API
requestId: 73125a6c-e866-4029-95a9-d0d6dc0ee4d7 – START: Requesting animal dog from Old Data API
requestId: 73125a6c-e866-4029-95a9-d0d6dc0ee4d7 – REPORT: Getting animal dog took 357.8300759792328 ms from New Data API
requestId: 73125a6c-e866-4029-95a9-d0d6dc0ee4d7 – REPORT: Getting animal dog took 1358.6942350268364 ms from Old Data API

# or

requestId: 08f05bc6-6846-45f4-a17c-41be100e2ae4 – SHADOW
requestId: 08f05bc6-6846-45f4-a17c-41be100e2ae4 – START: Requesting animal cat from New Data API
requestId: 08f05bc6-6846-45f4-a17c-41be100e2ae4 – START: Requesting animal cat from Old Data API
requestId: 08f05bc6-6846-45f4-a17c-41be100e2ae4 – REPORT: Getting animal cat took 605.9107409715652 ms from Old Data API
requestId: 08f05bc6-6846-45f4-a17c-41be100e2ae4 – REPORT: Getting animal cat took 1552.7539420127869 ms from New Data API
```

Note that the requestId values will be different, as well as the duration values.

In a real use case we could now apply some creative log querying to get valuable data about the performance differences between Old Data API and New Data API. Each individual request is easy to compare, as `requestId` can be used for grouping. And if New Data API was a real service instead of a static mock, one could monitor it's performance under load.

_**Question:** What happens if you remove the `SHADOW_TRAFFIC_ENABLED=true` part in the `npm start` script in [package.json](/package.json)?_

### Testing canary traffic

Open a new terminal window/tab and make a request:

```bash
curl 'http://localhost:3000/someData?trafficStrategy=canary&animal=dog'
# or
curl 'http://localhost:3000/someData?trafficStrategy=canary&animal=cat'
```

...and you should get a response along the lines of:

```bash
{"data":{"species":"dog","name":"Teppo","dataQuality":"Haven't seen Teppo in a long time so can't be sure ¯\\_(ツ)_/¯"}}
# or
{"data":{"species":"cat","name":"Maisa","dataQuality":"Old, not that fancy."}}
```

Meanwhile, the server logs (in the tab where you ran `npm run start`) should look something like:

```bash
requestId: 82de4c8f-a6f2-403d-a708-d8bfa94e6b41 – CANARY
requestId: 82de4c8f-a6f2-403d-a708-d8bfa94e6b41 – DEBUG: random value = 56, CANARY_THRESHOLD_PERCENT = 50
requestId: 82de4c8f-a6f2-403d-a708-d8bfa94e6b41 – START: Requesting animal dog from Old Data API
requestId: 82de4c8f-a6f2-403d-a708-d8bfa94e6b41 – REPORT: Getting animal dog took 1964.749628007412 ms from Old Data API

# or

requestId: b1978bb8-82ab-4b59-888f-ca53e2e3e2a9 – CANARY
requestId: b1978bb8-82ab-4b59-888f-ca53e2e3e2a9 – DEBUG: random value = 27, CANARY_THRESHOLD_PERCENT = 50
requestId: b1978bb8-82ab-4b59-888f-ca53e2e3e2a9 – START: Requesting animal cat from New Data API
requestId: b1978bb8-82ab-4b59-888f-ca53e2e3e2a9 – REPORT: Getting animal cat took 1011.1178050041199 ms from New Data API
```

Note that the requestId values will be different, as well as the duration values, random values, and the actual outcomes.

In the real world you could first set `CANARY_THRESHOLD_PERCENT` to a small value and gradually make it larger through changing the runtime environment variable and restarting the app, all while carefully monitoring the performance of New Data API under the slowly increasing load. This way it's easy to revert back to a smaller load if anything unpredicted happens.

_**Question:** What happens if you change the `CANARY_THRESHOLD_PERCENT` value in the `npm start` script in [package.json](/package.json) to 0? Or 100?_

## Pawesome! 🐾

The example data is about my sister's dog Touko, or Teppo as I like to call him, and my parents' cat Maisa. Both magnificent animals. 🐕 🐈

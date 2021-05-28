/**
 * This is the HTTP layer where requests come in, get validated and are
 * routed to the correct handler.
 */
import * as express from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import {
  handleDataRequestWithCanaryTraffic,
  handleDataRequestWithShadowTraffic,
} from './model';

const app = express();

/**
 * We want to explicitly define what kind of queries we accept...
 */
export const animal = z.union([z.literal('cat'), z.literal('dog')]);
const trafficStrategy = z.union([z.literal('shadow'), z.literal('canary')]);

const requestQuerySchema = z
  .object({
    animal,
    trafficStrategy,
  })
  .strict();

/**
 * ...and infer the static types based on those
 */
export type TAnimal = z.infer<typeof animal>;
export type TTrafficStrategy = z.infer<typeof trafficStrategy>;
export type TRequest = z.infer<typeof requestQuerySchema>;

/**
 * Handle requests coming in to path /some-data
 */
app.get('/someData', async (req, res) => {
  try {
    // Here we validate the query params and throw if they don't match
    const { animal, trafficStrategy } = requestQuerySchema.parse(req.query);

    // Each incoming request is given a unique ID to help performance logging
    const requestId = uuid();

    // For the sake of example, we handle the traffic strategy based on a query
    // parameter included in the request.
    if (trafficStrategy === 'shadow') {
      console.log(`requestId: ${requestId} – SHADOW`);
      res.json({
        data: await handleDataRequestWithShadowTraffic(requestId, animal),
      });
    } else {
      console.log(`requestId: ${requestId} – CANARY`);
      res.json({
        data: await handleDataRequestWithCanaryTraffic(requestId, animal),
      });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

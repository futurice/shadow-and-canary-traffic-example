/**
 * This is the HTTP layer where requests come in, get validated and are
 * routed to the correct handler.
 */
import * as express from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { handleDataRequest } from './model';

const app = express();

/**
 * We want to explicitly define what kind of queries we accept...
 */
const animal = z.union([z.literal('cat'), z.literal('dog')]);

const requestSchema = z
  .object({
    foo: z.union([z.literal('bar'), z.literal('baz')]),
    animal,
  })
  .strict();

/**
 * ...and infer the static types based on those
 */
export type TAnimal = z.infer<typeof animal>;
export type TRequest = z.infer<typeof requestSchema>;

/**
 * Handle requests coming in to path /some-data
 */
app.get('/some-data', async (req, res) => {
  try {
    // Here we validate the query params and throw if they don't match
    const parsedQuery = requestSchema.parse(req.query);

    // Each incoming request is given a unique ID to help performance logging
    const requestId = uuid();

    const data = await handleDataRequest(requestId, parsedQuery);

    res.json({ data });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

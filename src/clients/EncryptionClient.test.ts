import { CircleErrorResponse } from '../circle.types';
import { faker } from '@faker-js/faker';
import any from '@travi/any';
import nock from 'nock';
import { CircleClient } from '../CircleClient';
import { CircleError, NetworkError } from '../error';

const baseUrl = 'https://api.example.com';

describe('encryption client', () => {
  describe('getPublicKey', () => {
    it('should submit a GET request to /encryption/public and return the response', async () => {
      const encryptionResponse = { data: any.simpleObject() };

      const circleNock = nock(baseUrl).get('/encryption/public').reply(201, encryptionResponse);

      const client = new CircleClient(faker.datatype.uuid(), baseUrl);
      const result = await client.encryption.getPublicKey();

      expect(circleNock.isDone()).toBe(true);

      expect(result).toStrictEqual(encryptionResponse);
    });
  });

  it('should handle a network error', async () => {
    const circleNock = nock(baseUrl).get('/encryption/public').replyWithError(new Error());

    const client = new CircleClient(faker.datatype.uuid(), baseUrl);

    await expect(() => client.encryption.getPublicKey()).rejects.toThrowError(NetworkError);

    expect(circleNock.isDone()).toBe(true);
  });

  it('should handle a circle error', async () => {
    const circleError: CircleErrorResponse = {
      code: 1,
      message: faker.lorem.sentence(),
    };

    const circleNock = nock(baseUrl).get('/encryption/public').reply(400, circleError);

    const client = new CircleClient(faker.datatype.uuid(), baseUrl);

    await expect(() => client.encryption.getPublicKey()).rejects.toThrowError(new CircleError(circleError));
    expect(circleNock.isDone()).toBe(true);
  });
});

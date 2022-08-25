import { CircleErrorResponse, CreateCardParams } from '../circle.types';
import { faker } from '@faker-js/faker';
import any from '@travi/any';
import nock from 'nock';
import { CircleClient } from '../CircleClient';
import { CircleError, NetworkError } from '../error';

const baseUrl = 'https://api.example.com';

describe('card client', () => {
  describe('createCard', () => {
    it('should create a card using the circle API', async () => {
      const params: CreateCardParams = {
        keyId: faker.datatype.uuid(),
        billingDetails: {
          name: faker.name.fullName(),
          city: faker.address.city(),
          country: faker.address.country(),
          line1: faker.address.street(),
          postalCode: faker.address.zipCode(),
        },
        encryptedData: faker.datatype.string(),
        expMonth: faker.datatype.number({ min: 1, max: 12 }),
        expYear: faker.datatype.number({ min: 2020, max: 2030 }),
        idempotencyKey: faker.datatype.uuid(),
        metadata: {
          email: faker.internet.email(),
          sessionId: faker.datatype.uuid(),
          ipAddress: faker.internet.ipv4(),
          phoneNumber: faker.phone.number(),
        },
      };

      const cardResponse = { data: any.simpleObject() };

      const circleNock = nock(baseUrl)
        .post('/cards', params as never)
        .reply(201, cardResponse);

      const client = new CircleClient(faker.datatype.uuid(), baseUrl);
      const result = await client.card.createCard(params);

      expect(circleNock.isDone()).toBe(true);

      expect(result).toStrictEqual(cardResponse);
    });
  });

  it('should handle a network error', async () => {
    const circleNock = nock(baseUrl).post('/cards').replyWithError(new Error());

    const client = new CircleClient(faker.datatype.uuid(), baseUrl);

    await expect(() => client.card.createCard({} as never)).rejects.toThrowError(NetworkError);

    expect(circleNock.isDone()).toBe(true);
  });

  it('should handle a card error', async () => {
    const cardError: CircleErrorResponse = {
      code: 1,
      message: faker.lorem.sentence(),
    };

    const circleNock = nock(baseUrl).post('/cards').reply(400, cardError);

    const client = new CircleClient(faker.datatype.uuid(), baseUrl);

    await expect(() => client.card.createCard({} as never)).rejects.toThrowError(new CircleError(cardError));
    expect(circleNock.isDone()).toBe(true);
  });
});

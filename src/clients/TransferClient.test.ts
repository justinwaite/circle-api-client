import any from '@travi/any';
import nock from 'nock';
import { CircleClient } from '../CircleClient';
import { faker } from '@faker-js/faker';

const baseUrl = 'https://api.example.com';

describe('transfer client', () => {
  describe('create', () => {
    it('should submit a POST request to /transfers and return the response', async () => {
      const createTransferResponse = { data: any.simpleObject() };

      const circleNock = nock(baseUrl).post('/transfers').reply(201, createTransferResponse);

      const client = new CircleClient(faker.datatype.uuid(), baseUrl);
      const result = await client.transfer.create(any.simpleObject() as never);

      expect(circleNock.isDone()).toBe(true);

      expect(result).toStrictEqual(createTransferResponse);
    });

    it('should submit a POST request to /businessAccount/transfers if the user provides the option "useBusinessAccountIdentity"', async () => {
      const createTransferResponse = { data: any.simpleObject() };

      const circleNock = nock(baseUrl).post('/businessAccount/transfers').reply(201, createTransferResponse);

      const client = new CircleClient(faker.datatype.uuid(), baseUrl);
      const result = await client.transfer.create(any.simpleObject() as never, { useBusinessAccountIdentity: true });

      expect(circleNock.isDone()).toBe(true);

      expect(result).toStrictEqual(createTransferResponse);
    });
  });
});

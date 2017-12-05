'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';
import slack from "serverless-slack";

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const usersService = new DynamoDBService(dynamoDbClient, process.env.USERS_TABLE_NAME);
const websitesService = new DynamoDBService(dynamoDbClient, process.env.WEBSITES_TABLE_NAME);
const codesService = new DynamoDBService(dynamoDbClient, process.env.CODES_TABLE_NAME);

export const handler = slack.handler.bind(slack);
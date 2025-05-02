const fs = require('fs');
const path = require('path');
const { MongoClient, MongoNetworkError } = require('mongodb');

const requestFilePath = path.resolve(__dirname, '../src/api/core/request.ts');

const patchExport = () => {
  if (!fs.existsSync(requestFilePath)) {
    console.error(`file not found: ${requestFilePath}`);
    process.exit(1);
  }

  const originalContent = fs.readFileSync(requestFilePath, 'utf-8');

  if (originalContent.includes("apiClient")) {
    console.log('request.ts is already patched');
    return;
  }

  const modifiedContent = originalContent
    .replace("import axios from 'axios';", "import axios from 'axios';\nimport apiClient from '../apiClient';")
    .replace("axiosClient: AxiosInstance = axios", "axiosClient: AxiosInstance = apiClient");

  const finalContent = `${modifiedContent}\n`;

  fs.writeFileSync(requestFilePath, finalContent, 'utf-8');

  console.log('request.ts is patched');
};

const shutdownDatabase = async () => {
  const MONGO_HOST = process.env.MONGO_HOST;
  const MONGO_PORT = process.env.MONGO_PORT;
  const MONGO_ROOT_USERNAME = process.env.MONGO_ROOT_USERNAME;
  const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD;

  const url = `mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('admin');
    await db.command({ shutdown: 1 });
  } catch(e) {
    if (e instanceof MongoNetworkError)
      console.log('Shutdown signal successfully sent!');
    else
      console.log(`Error: ${e.toString()}`);
  } finally {
    await client.close();
  }
};

patchExport();
shutdownDatabase();

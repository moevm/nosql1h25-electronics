const fs = require('fs');
const path = require('path');

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

patchExport();

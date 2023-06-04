import fs from 'fs';
import Debug from '../Debug';

export const loadJson = (path: string): Promise<any> => {
  // Read JSON file
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        Debug.error('Error reading file:', err);
        reject(new Error(`Error parsing JSON: ${err}`));
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        Debug.error('Error parsing JSON:', error);
        reject(new Error(`Error parsing JSON: ${error}`));
      }
    });
  })
  
}
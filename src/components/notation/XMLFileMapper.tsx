import * as fs from 'fs/promises'; // Use the promises API
import * as path from 'node:path';

/**
 * Recursively reads all files in a directory and creates a Map.
 * @param dirPath The starting directory path.
 * @param fileMap The Map to populate (optional, used for recursion).
 * @returns A Map with file names as keys and full paths as values.
 */

export function CreateFileMap(dirPath: string, fileMap: Map<string, string> = new Map()): Map<string, string> {
   const entries = fs.readdir(dirPath, { withFileTypes: true, recursive: true });

   entries

   for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
         // Recursively call for subdirectories
         CreateFileMap(fullPath, fileMap);
      } else {
         // Add file to the map
         fileMap.set(entry.name, fullPath);
      }
   }
   console.log(fileMap)
   return fileMap;
}
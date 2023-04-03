import * as fs from 'fs/promises';
import * as path from 'path';

const definitionsFolderPath = './src/definitions';

const bundledDefinitionsPath = path.join(__dirname, '../dist', 'graph.d.ts');

async function bundleDefinitions() {
  try {
    const files: string[] = await fs.readdir(definitionsFolderPath);
    const definitionFiles = files.filter(file => file.endsWith('.d.ts'));

    let content: string = '';
    for (const file of definitionFiles) {
      const fileContent: string = await fs.readFile(path.join(definitionsFolderPath, file), 'utf-8');
      content += fileContent + '\n';
    }

    await fs.mkdir(path.dirname(bundledDefinitionsPath), { recursive: true });
    await fs.writeFile(bundledDefinitionsPath, content);

    console.error('Defintion files bundled.');
  } catch (err) {
    console.error('Error bundling definition files:', err);
  }
}

bundleDefinitions();
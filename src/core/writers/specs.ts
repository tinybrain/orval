import chalk from 'chalk';
import { log } from 'console';
import execa from 'execa';
import { appendFile, outputFile, pathExists, readFile } from 'fs-extra';
import uniq from 'lodash.uniq';
import { join } from 'upath';
import { NormalizedOptions, OutputMode } from '../../types';
import { WriteSpecsProps } from '../../types/writers';
import { jsDoc } from '../../utils/doc';
import { getFileInfo } from '../../utils/file';
import { createSuccessMessage } from '../../utils/messages/logs';
import { getSpecName, relativeSafe } from '../../utils/path';
import { writeSchemas } from './schemas';
import { writeSingleMode } from './singleMode';
import { writeSplitMode } from './splitMode';
import { writeSplitTagsMode } from './splitTagsMode';
import { writeTagsMode } from './tagsMode';

export const writeSpecs = async (
  { operations, schemas, target, info }: WriteSpecsProps,
  workspace: string,
  options: NormalizedOptions,
  projectName?: string,
) => {
  const { output } = options;
  const projectTitle = projectName || info.title;

  const specsName = Object.keys(schemas).reduce((acc, specKey) => {
    const basePath = getSpecName(specKey, target);
    const name = basePath.slice(1).split('/').join('-');

    acc[specKey] = name;

    return acc;
  }, {} as Record<keyof typeof schemas, string>);

  const header = output.override.header
    ? jsDoc({
        description: output.override.header(info),
      })
    : '';

  if (output.schemas) {
    const rootSchemaPath = output.schemas;

    await Promise.all(
      Object.entries(schemas).map(([specKey, schemas]) => {
        const isRootKey = target === specKey;
        const schemaPath = !isRootKey
          ? join(rootSchemaPath, specsName[specKey])
          : rootSchemaPath;

        return writeSchemas({
          schemaPath,
          schemas,
          target,
          specsName,
          isRootKey,
          header,
        });
      }),
    );
  }

  let implementationPaths: string[] = [];

  if (output.target) {
    switch (output.mode) {
      case OutputMode.SPLIT:
        implementationPaths = await writeSplitMode({
          workspace,
          operations,
          output,
          info,
          schemas,
          specsName,
          header,
        });
        break;
      case OutputMode.TAGS:
        implementationPaths = await writeTagsMode({
          workspace,
          operations,
          output,
          info,
          schemas,
          specsName,
          header,
        });
        break;
      case OutputMode.TAGS_SPLIT:
        implementationPaths = await writeSplitTagsMode({
          workspace,
          operations,
          output,
          info,
          schemas,
          specsName,
          header,
        });
        break;
      case OutputMode.SINGLE:
      default:
        implementationPaths = await writeSingleMode({
          workspace,
          operations,
          output,
          info,
          schemas,
          specsName,
          header,
        });
        break;
    }
  }

  if (output.workspace) {
    const workspacePath = output.workspace;
    let imports = implementationPaths
      .filter((path) => !path.endsWith('.msw.ts'))
      .map((path) =>
        relativeSafe(workspacePath, getFileInfo(path).pathWithoutExtension),
      );

    if (output.schemas) {
      imports.push(
        relativeSafe(workspacePath, getFileInfo(output.schemas).dirname),
      );
    }

    const indexFile = join(workspacePath, '/index.ts');

    if (await pathExists(indexFile)) {
      const data = await readFile(indexFile, 'utf8');
      const importsNotDeclared = imports.filter((imp) => !data.includes(imp));
      await appendFile(
        indexFile,
        uniq(importsNotDeclared)
          .map((imp) => `export * from '${imp}';`)
          .join('\n') + '\n',
      );
    } else {
      await outputFile(
        indexFile,
        uniq(imports)
          .map((imp) => `export * from '${imp}';`)
          .join('\n') + '\n',
      );
    }

    implementationPaths = [indexFile, ...implementationPaths];
  }

  if (output.prettier) {
    try {
      await execa('prettier', [
        '--write',
        ...(output.schemas ? [getFileInfo(output.schemas).dirname] : []),
        ...implementationPaths,
      ]);
    } catch (e) {
      log(
        chalk.yellow(
          `⚠️  ${projectTitle ? `${projectTitle} - ` : ''}Prettier not found`,
        ),
      );
    }
  }

  createSuccessMessage(projectTitle);
};

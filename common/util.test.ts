import { Buffer } from "https://deno.land/std@0.85.0/node/buffer.ts";
const __dirname = (() => {
    const { url: urlStr } = import.meta;
    const url = new URL(urlStr);
    const __filename = (url.protocol === "file:" ? url.pathname : urlStr)
        .replace(/[/][^/]*$/, '');

    const isWindows = (() => {

        let NATIVE_OS: typeof Deno.build.os = "linux";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigator = (globalThis as any).navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.("Win") ?? false) {
            NATIVE_OS = "windows";
        }

        return NATIVE_OS == "windows";

    })();

    return isWindows ?
        __filename.split("/").join("\\").substring(1) :
        __filename;
})();

import { fork } from 'child_process DENOIFY: DEPENDENCY UNMET (BUILTIN)';
import { unlink, writeFileSync } from 'https://deno.land/std@0.85.0/node/fs.ts';
import * as path from 'https://deno.land/std@0.85.0/node/path.ts';

/**
 * Runs the code in a child process, and returns its stdout/err string.
 */
export async function runInChild(code: string) {
  const cwd = path.resolve(__dirname, '..', '..');
  const file = path.resolve(cwd, '.test.js');

  after(done => unlink(file, () => done()));

  writeFileSync(file, `const { Policy } = require('./');\n${code}`);

  const child = fork(file, [], { cwd, stdio: 'pipe' });
  const output: Buffer[] = [];
  child.stderr?.on('data', d => output.push(d));
  child.stdout?.on('data', d => output.push(d));

  await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', resolve);
  });

  return Buffer.concat(output).toString().replace(/\r?\n/g, '\n').trim();
}

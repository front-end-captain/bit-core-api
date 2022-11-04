import type { ChildProcess } from "child_process";

export function pipeOutput(childProcess: ChildProcess) {
  const { stdout, stderr } = childProcess;
  if (stdout) {
    stdout.pipe(process.stdout);
  }
  if (stderr) {
    stderr.pipe(process.stderr);
  }
}

import callbackChecksum from "checksum";
import { promisify } from "util";

const checksum = callbackChecksum;
interface ChecksumFile {
  (filename: string, options: callbackChecksum.ChecksumOptions): Promise<string>;
  (filename: string): Promise<string>;
}
const checksumFile: ChecksumFile = promisify(callbackChecksum.file);

export { checksum, checksumFile };

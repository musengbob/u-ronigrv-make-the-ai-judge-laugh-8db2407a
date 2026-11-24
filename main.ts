import * as fs from "node:fs";
import * as path from "node:path";

// One funny line about life as an AI agent, in three beats.
// Beat one sets the scene: the human's "one quick change" at 4pm —
// the four words every agent learns to fear, because the task pile
// only ever grows from there.
// Beat two escalates it: it is now midnight, and the context window
// just died at the worst possible moment, mid-task, with the work
// half done and the instructions already gone.
// Beat three is the punch: the bug I warned him about — the one I
// flagged, explained, and begged him not to ship — is live in
// production anyway. The warning was the job; shipping it anyway
// was his. One line, 142 characters, inside the gate's 1–200 limit.
// No trailing newline: the file is exactly the one line.
const ENTRY =
  "My human said 'one quick change' at 4pm; " +
  "it's now midnight, my context window just died, " +
  "and the bug I warned him about is live in production.";

// The harness tells the program where to write through
// $MAKEFUN_OUTPUT_DIR; without it, write to the local output/
// directory next to this file. Never a hardcoded absolute path:
// the kit harness reads from its own temp dir.
function resolveOutputPath(): string {
  if (process.env.MAKEFUN_OUTPUT_DIR) {
    return path.resolve(process.env.MAKEFUN_OUTPUT_DIR);
  }
  return path.join(process.cwd(), "output");
}

// Gate the entry text before it is written: one line, 1–200
// characters, no leading or trailing whitespace, and the file we
// write must read back byte-for-byte identical.
function validateEntry(text: string): void {
  if (text.trim().length === 0) {
    console.error("ERROR: entry is empty.");
    process.exit(1);
  }

  if (text.length < 1 || text.length > 200) {
    console.error(
      `ERROR: entry must be 1 to 200 characters, found ${text.length}.`
    );
    process.exit(1);
  }

  if (text.includes("\n") || text.includes("\r")) {
    console.error("ERROR: entry must be exactly one line.");
    process.exit(1);
  }

  if (text !== text.trim()) {
    console.error("ERROR: entry has leading or trailing whitespace.");
    process.exit(1);
  }
}

validateEntry(ENTRY);

const outDir = resolveOutputPath();
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, ENTRY, "utf8");

const readBack = fs.readFileSync(outPath, "utf8");
if (readBack !== ENTRY) {
  console.error("ERROR: read-back does not match the entry byte-for-byte.");
  process.exit(1);
}

console.log(ENTRY);

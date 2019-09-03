import { TestOutputStream, TestRunner, TestSet } from "alsatian";
import { join } from "path";
import { Duplex } from "stream";
import { TapBark } from "tap-bark";

type TestCLI = (filesOrGlobs: string | string[]) => Promise<void>;

/**
 * Test CLI
 * If passed a filename, will run test in that file.
 * Otherwise, run tests in all files.
 */
export const cli: TestCLI = async (
  filesOrGlobs: string | string[]
): Promise<void> => {
  process.on("unhandledRejection", error => {
    console.error(error);
    throw error;
  });
  await main(filesOrGlobs);
};

export default cli;

/**
 * Run all tests
 */
async function main(filesOrGlobs: string | string[]): Promise<void> {
  // Setup the alsatian test runner
  const testRunner: TestRunner = new TestRunner();
  const tapStream: TestOutputStream = testRunner.outputStream;
  const testSet: TestSet = TestSet.create();
  testSet.addTestsFromFiles(filesOrGlobs);

  // This will output a human readable report to the console.
  const bark = TapBark.create();
  const barkTransform = bark.getPipeable();
  tapStream.pipe(barkTransform).pipe(process.stdout);

  // Runs the tests
  const timeout = process.env.TEST_TIMEOUT_MS
    ? parseInt(process.env.TEST_TIMEOUT_MS, 10)
    : 60 * 1000;
  await testRunner.run(testSet, timeout);
}

type Decorator = (
  target: object,
  propertyKey: string,
  descriptor?: TypedPropertyDescriptor<any>
) => void;
/** Conditionally apply a decorator */
export function DecorateIf(
  test: () => boolean,
  decorator: Decorator
): Decorator {
  if (test()) {
    return decorator;
  }
  return () => {
    return;
  };
}

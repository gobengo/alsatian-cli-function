# alsatian-cli-function

Exports a function to run a provided file using [alsatian](https://github.com/alsatian-test/alsatian).

## Why?

So you can easily turn each of your alsatian test files into an executable script that doesn't depend on the `alsatian` CLI. You can just run it with `node path/to/your/file.js` or `ts-node path/to/your/file.ts`.

YourTest.ts:

```typescript
// no globals and typing support out of the box with intellisense
import { Expect, Test, TestFixture } from "alsatian";
import cli from "alsatian-cli-function";

@TestFixture("whatever you'd like to call the fixture")
export class YourTestFixture {
    @TestCase(3, 3, 6)
    @Test("addition tests")
    public addTest(firstNumber: number, secondNumber: number, expectedSum: number) {
        Expect(firstNumber + secondNumber).toBe(expectedSum);
    }
}

if (require.main === module) {
  (async () => {
    await cli(__filename);
  })();
}
```

Then: `ts-node YourTest.ts` to run the tests in that file.

## Gratitudes

Thank you to [jamesadarich](https://github.com/jamesadarich) and other [contributors](https://github.com/alsatian-test/alsatian/graphs/contributors) for working on alsatian. 

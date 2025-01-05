import {checkByLine} from '../src/TofuCheck'

describe('checkByLine test', () => {
    test('OK', async () => {
        const characterContent = "adf"
        const res = () => checkByLine(["aaa", "bbb", "ccc"], "filename", characterContent)
        expect(res).
            toThrow(
                new Error("ERROR: Not found characters:\n b / c"
            ));
    })
})

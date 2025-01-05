import {checkByLine} from '../src/TofuCheck'

describe('checkByLine test', () => {
    test('OK', async () => {
        const characterContent = "adf"
        const res = checkByLine(["aaa", "bbb", "ccc"], "filename", characterContent)
        expect(res).toEqual({isAllIncluded: false, missingChars: ["b", "c"]})
    })
})

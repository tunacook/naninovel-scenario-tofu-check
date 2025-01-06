import { checkByLine } from '../src/TofuCheck'

describe('checkByLine test', () => {
  test('aが存在するが、bとcが存在しない', async () => {
    const characterContent = 'adf'
    const res = () => checkByLine(['aaa', 'bbb', 'ccc'], 'filename', characterContent)
    expect(res).toThrow(new Error('ERROR: Not found characters:\n b / c'))
  })
})

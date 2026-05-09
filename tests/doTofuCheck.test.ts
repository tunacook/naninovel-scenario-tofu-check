import { checkByLine, trimCurlyBraces } from '../src/TofuCheck'

describe('checkByLine test', () => {
  test('aが存在するが、bとcが存在しない', async () => {
    const characterContent = 'adf'
    const res = () => checkByLine(['aaa', 'bbb', 'ccc'], 'filename', characterContent)
    expect(res).toThrow(new Error('ERROR: Not found characters:\n b / c'))
  })

  test('コメント部分はスキップ', async () => {
    const characterContent = 'adf'
    const res = () => checkByLine(['aaa', ';bbb', 'ccc'], 'filename', characterContent)
    expect(res).toThrow(new Error('ERROR: Not found characters:\n c'))
  })

  test('スクリプト部分はスキップ', async () => {
    const characterContent = 'adf'
    const res = () => checkByLine(['aaa', '@bbb', 'ccc'], 'filename', characterContent)
    expect(res).toThrow(new Error('ERROR: Not found characters:\n c'))
  })
})

describe('trimCurlyBraces test', () => {
  test('単純な変数展開を除去する', () => {
    expect(trimCurlyBraces('Hello {playerName}!')).toBe('Hello !')
  })

  test('複数の変数展開を除去する', () => {
    expect(trimCurlyBraces('{greeting} {name}!')).toBe(' !')
  })

  test('変数展開がない場合はそのまま', () => {
    expect(trimCurlyBraces('Hello World!')).toBe('Hello World!')
  })

  test('空の波括弧を除去する', () => {
    expect(trimCurlyBraces('before{}after')).toBe('beforeafter')
  })
})

describe('checkByLine with curly braces', () => {
  test('変数展開部分はチェックしない', async () => {
    const characterContent = 'adf'
    const res = checkByLine(['aaa', 'ddd{xyz}fff'], 'filename', characterContent)
    expect(res.isAllIncluded).toBe(true)
  })

  test('変数展開以外の不足文字は検出する', async () => {
    const characterContent = 'adf'
    const res = () => checkByLine(['{xyz}b'], 'filename', characterContent)
    expect(res).toThrow(new Error('ERROR: Not found characters:\n b'))
  })
})

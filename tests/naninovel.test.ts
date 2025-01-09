import { isExtNani, trimAuthor, trimBracket, trimSquareBrackets, trimRuby } from '../src/naninovel'

describe('trimAuthor test', () => {
  test('セリフの場合は話者IDを除外して返す', async () => {
    const lineContent = 'レイチェル: んー……それはそうなんだけどさ。'
    const res = trimAuthor(lineContent)
    expect(res).toBe('んー……それはそうなんだけどさ。')
  })

  test('セリフでない文章の場合はそのまま返す', async () => {
    const lineContent = 'んー……それはそうなんだけどさ。'
    const res = trimAuthor(lineContent)
    expect(res).toBe('んー……それはそうなんだけどさ。')
  })
})

describe('isExtNani test', () => {
  test('.naniのファイルパスが渡された', async () => {
    const filePath = 'hoge/huga.nani'
    const res = isExtNani(filePath)
    expect(res).toBe(true)
  })

  test('.txtのファイルパスが渡された', async () => {
    const filePath = 'hoge/huga.txt'
    const res = isExtNani(filePath)
    expect(res).toBe(false)
  })

  test('ディレクトリパスが渡された', async () => {
    const filePath = 'hoge/huga'
    const res = isExtNani(filePath)
    expect(res).toBe(false)
  })
})

describe('trimBracket test', () => {
  test('<br>をトリミングする', async () => {
    const res = trimBracket('<br>')
    expect(res).toBe('')
  })
})

describe('trimSquareBrackets test', () => {
  test('[br]をトリミングする', async () => {
    const res = trimSquareBrackets('[br]')
    expect(res).toBe('')
  })
})

describe('trimRuby test', () => {
  test('rubyタグをトリミングする', async () => {
    const res = trimRuby('<ruby="・">彼</ruby><ruby="・">女</ruby>')
    expect(res).toBe('彼・女・')
  })
})

import { isExtNani, trimAuthor } from '../src/naninovel'

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

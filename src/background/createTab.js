export async function createTab(path) {
  const url = chrome.runtime.getURL(path)

  const tab = await chrome.tabs.create({ url })

  return tab
}

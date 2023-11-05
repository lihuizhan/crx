import { OPTIONS_CONFIG_KEY } from '$/globalConfig'

export async function getOptionsConfig() {
  const { [OPTIONS_CONFIG_KEY]: config } = await chrome.storage.local.get(OPTIONS_CONFIG_KEY)
  // console.log(config)
  return config || {}
}

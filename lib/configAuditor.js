// check user config against default roosevelt configuration

require('colors');

(function configAudit () {
  const path = require('path')
  const appDir = require('./getAppDir')
  const checkParamObject = require('./checkParamObject')
  const defaultConfig = require('./defaultConfig.json')
  const defaultConfigKeys = Object.keys(defaultConfig)
  const defaultScripts = require('./defaultScripts.json')
  const defaultScriptKeys = Object.keys(defaultScripts)
  let pkg
  let userConfig
  let userConfigKeys
  let userScripts
  let errors

  try {
    // if package cannot be found (e.g., script triggered without app present), skip audit
    pkg = require(path.join(appDir, 'package.json'))
    userConfig = pkg.rooseveltConfig || {}
    userConfigKeys = Object.keys(userConfig)
    userScripts = pkg.scripts || {}
  } catch (e) {
    return
  }

  console.log('📋  Starting roosevelt user configuration audit...'.bold)

  defaultConfigKeys.forEach(function (defaultParam) {
    if (userConfig[defaultParam] === undefined) {
      console.log(`⚠️   Missing param ${defaultParam}!`.red.bold)
      errors = true
    } else if (typeof defaultConfig[defaultParam] !== typeof userConfig[defaultParam]) {
      console.log(`⚠️   Param ${defaultParam} structured incorrectly, should be ${typeof defaultParam}`.red.bold)
      errors = true
    } else if (defaultConfig[defaultParam] !== (undefined || []) && defaultConfig[defaultParam] instanceof Object) {
      if (checkParamObject(userConfig[defaultParam], defaultConfig[defaultParam], defaultParam)) {
        errors = true
      }
    }
  })

  userConfigKeys.forEach(function (userParam) {
    if (defaultConfig[userParam] === undefined) {
      console.log(`⚠️   Extra param ${userParam} found, this can be removed.`.red.bold)
      errors = true
    }
  })

  defaultScriptKeys.forEach(function (defaultScript) {
    if (userScripts[defaultScript] === undefined) {
      console.log(`⚠️   Missing script ${defaultScript}!`.red.bold)
      errors = true
    }
  })

  if (errors) {
    console.log('❌  Issues have been detected in roosevelt config, please consult https://github.com/rooseveltframework/roosevelt#configure-your-app-with-parameters for details on each param.'.bold.red)
  } else {
    console.log('✔  Configuration audit completed with no errors found.')
  }
})()
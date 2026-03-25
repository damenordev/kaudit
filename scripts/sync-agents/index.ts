#!/usr/bin/env node
import * as fs from 'node:fs'
import * as path from 'node:path'

import { CONFIG } from './config.js'
import { copyDirSync } from './copy-dir.js'

const mainSkillsDir = path.join(process.cwd(), CONFIG.sourceFolder, 'skills')
const alternateSkillsDir = path.join(process.cwd(), CONFIG.alternateSource, 'skills')

if (fs.existsSync(alternateSkillsDir)) {
  console.log(`Merging skills from ${alternateSkillsDir} to ${mainSkillsDir}...`)
  copyDirSync(alternateSkillsDir, mainSkillsDir)
}

console.log('Syncing rules and skills to all agent folders...')

for (const folder of CONFIG.targetFolders) {
  const targetRoot = path.join(process.cwd(), folder)

  if (!fs.existsSync(targetRoot)) {
    fs.mkdirSync(targetRoot, { recursive: true })
  }

  console.log(`Syncing to ${folder}...`)

  const targetRulesDir = path.join(targetRoot, 'rules')
  if (!fs.existsSync(targetRulesDir)) {
    fs.mkdirSync(targetRulesDir, { recursive: true })
  }

  for (const oldFile of [CONFIG.oldRulesFile, CONFIG.legacyRulesFile]) {
    const oldPath = path.join(targetRulesDir, oldFile)
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath)
      console.log(`  Deleted old ${oldFile}`)
    }
  }

  const srcRuleFile = path.join(process.cwd(), CONFIG.sourceFolder, 'rules', CONFIG.rulesFile)
  if (fs.existsSync(srcRuleFile)) {
    fs.copyFileSync(srcRuleFile, path.join(targetRulesDir, CONFIG.rulesFile))
    console.log(`  Copied ${CONFIG.rulesFile} to ${targetRulesDir}`)
  }

  const targetSkillsDir = path.join(targetRoot, 'skills')
  if (fs.existsSync(mainSkillsDir)) {
    copyDirSync(mainSkillsDir, targetSkillsDir)
    console.log(`  Copied skills to ${targetSkillsDir}`)
  }
}

console.log('✅ Sync complete!')

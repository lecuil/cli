import log from 'npmlog'

log.level = process.env.LOG_LEVEL || 'info'

log.heading = 'lecuil'
log.headingStyle = { fg: 'cyan', bold: true }
log.addLevel('success', 2000, { fg: 'green', bold: true })

export default log

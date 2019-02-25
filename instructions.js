'use strict'

/**
 * adonis-throttle
 *
 * (c) Andrew Jo <andrewjo@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { join } = require('path')

module.exports = async function (cli) {
  try {
    const configTemplatePath = join(__dirname, './templates/config.mustache')
    await cli.makeConfig('throttle.js', configTemplatePath)
  } catch (error) {
    // Ignore if config/throttle.js already exists in user's project directory.
  }
}

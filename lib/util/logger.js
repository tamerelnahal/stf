/* eslint quote-props:0 */
var util = require('util')
var events = require('events')

var chalk = require('chalk')

var Logger = new events.EventEmitter()

Logger.Level = {
  DEBUG: 1
, VERBOSE: 2
, INFO: 3
, IMPORTANT: 4
, WARNING: 5
, ERROR: 6
, FATAL: 7
, INTERVAL: 8
}

// Exposed for other modules
Logger.LevelLabel = {
  1: 'DBG'
, 2: 'VRB'
, 3: 'INF'
, 4: 'IMP'
, 5: 'WRN'
, 6: 'ERR'
, 7: 'FTL'
, 8: 'INT'
}

Logger.globalIdentifier = '*'

function Log(tag) {
  this.tag = tag
  this.names = {
    1: 'DBG'
  , 2: 'VRB'
  , 3: 'INF'
  , 4: 'IMP'
  , 5: 'WRN'
  , 6: 'ERR'
  , 7: 'FTL'
  , 8: 'INT'
  }
  this.styles = {
    1: 'grey'
  , 2: 'cyan'
  , 3: 'green'
  , 4: 'magenta'
  , 5: 'yellow'
  , 6: 'red'
  , 7: 'red'
  , 8: 'magenta'
  }
  this.localIdentifier = null
  events.EventEmitter.call(this)
}

util.inherits(Log, events.EventEmitter)

Logger.createLogger = function(tag) {
  return new Log(tag)
}

Logger.setGlobalIdentifier = function(identifier) {
  Logger.globalIdentifier = identifier
  return Logger
}

Log.Entry = function(timestamp, priority, tag, pid, identifier, message, username) {
  this.timestamp = timestamp
  this.priority = priority
  this.tag = tag
  this.pid = pid
  this.username = username
  this.identifier = identifier
  this.message = message
}

Log.prototype.setLocalIdentifier = function(identifier) {
  this.localIdentifier = identifier
}

Log.prototype.debug = function() {
  this._write(this._entry(Logger.Level.DEBUG, arguments))
}

Log.prototype.verbose = function() {
  this._write(this._entry(Logger.Level.VERBOSE, arguments))
}

Log.prototype.info = function() {
  this._write(this._entry(Logger.Level.INFO, arguments))
}

Log.prototype.interval = function() {
	console.log(arguments);
  this._write(this._entry(Logger.Level.INTERVAL, arguments))
}

Log.prototype.important = function() {
	console.log(arguments);
  this._write(this._entry(Logger.Level.IMPORTANT, arguments))
}

Log.prototype.warn = function() {
  this._write(this._entry(Logger.Level.WARNING, arguments))
}

Log.prototype.error = function() {
  this._write(this._entry(Logger.Level.ERROR, arguments))
}

Log.prototype.fatal = function() {
  this._write(this._entry(Logger.Level.FATAL, arguments))
}

Log.prototype._entry = function(priority, args) {
  return new Log.Entry(
      new Date()
    , priority
    , this.tag
    , process.pid
    , this.localIdentifier || Logger.globalIdentifier
    , util.format.apply(util, args)
  )
}

Log.prototype._format = function(entry) {
  return util.format('%s %s/%s %d [%s] %s (%s)'
    , chalk.grey(entry.timestamp.toJSON())
    , this._name(entry.priority)
    , chalk.bold(entry.tag)
    , entry.pid
    , entry.identifier
    , entry.message
    , entry.username
  )
}

Log.prototype._name = function(priority) {
  return chalk[this.styles[priority]](this.names[priority])
}

/* eslint no-console: 0 */
Log.prototype._write = function(entry) {
  console.error(this._format(entry))
  this.emit('entry', entry)
  Logger.emit('entry', entry)
}

exports = module.exports = Logger

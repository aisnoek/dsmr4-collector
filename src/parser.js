/**
 * @param packet
 * @returns {}
 */
function parser(packet) {
  var lines = packet.split(/\r\n|\n|\r/);
  var result = {
    datetime: null,
    dsmr: {
      version: null
    },
    usage: {
      rate_1: null,
      rate_2: null
    },
    returned: {
      rate_1: null,
      rate_2: null
    },
    realtime: {
      usage: null,
      production: null
    },
    gas: {
      datetime: null,
      value: null
    }
  };

  for (var i = 1; i < lines.length; i++) {
    var line = _parseLine(lines[i]);

    switch (line.code) {
      case '96.1.1':
      case '96.14.0':
      case '96.7.21':
      case '96.7.9':
      case '99.97.0':
      case '32.32.0':
      case '32.36.0':
      case '96.13.1':
      case '96.13.0':
      case '31.7.0':
      case '21.7.0':
      case '22.7.0':
      case '24.1.0':
      case '96.1.0':
      default:
        // unknown
        break;
      case '0.2.8':
        result.dsmr.version = line.value;
        break;
      case '1.0.0':
        result.datetime = _parseDate(line.value);
        break;
      case '1.8.1':
        result.usage.rate_1 = _parseValue(line.value).value;
        break;
      case '2.8.1':
        result.returned.rate_1 = _parseValue(line.value).value;
        break;
      case '1.8.2':
        result.usage.rate_2 = _parseValue(line.value).value;
        break;
      case '2.8.2':
        result.returned.rate_2 = _parseValue(line.value).value;
        break;
      case '1.7.0':
        result.realtime.usage = _parseValue(line.value).value;
        break;
      case '2.7.0':
        result.realtime.production = _parseValue(line.value).value;
        break;
      case '24.2.1':
        result.gas.datetime = _parseDate(line.value[0]);
        result.gas.value = _parseValue(line.value[1]).value;
        break
    }
  }

  return result;
}

/**
 * TODO: duh, look at the code dude...
 *
 * @param date
 * @returns {*}
 * @private
 */
function _parseDate(date) {
  return date;
}

/**
 * @param line
 * @returns {{full_code: *, code: *, values: Array}}
 * @private
 */
function _parseLine(line) {
  var result = {
    full_code: null,
    code: null,
    values: null
  };
  var matches = line.match(/^([0-9\-\:\.]*)(\(.*\))$/);

  if (matches != null) {
    var value = matches[2].substr(1, matches[2].length - 2).split(')(');

    result.full_code = matches[1];
    result.code = matches[1].split(':')[1];
    result.value = (Array.isArray(value) && value.length == 1) ? value[0] : value;
  }

  return result;
}

/**
 *
 * @param value
 * @returns {{value: *, unit: *}}
 * @private
 */
function _parseValue(value) {
  var valueUnit = value.split('*');

  return {
    value: valueUnit[0],
    unit: valueUnit[1]
  }
}

module.exports = parser;

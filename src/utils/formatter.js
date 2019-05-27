module.exports = function morganLogFormatter(tokens, req, res) {
  const addr = tokens['remote-addr'](req, res);
  const addrShortened = addr.replace(/\.\d+\.\d+$/, '.');
  const url = req.originalUrl || req.url;
  const referrer = req.headers.referer || req.headers.referrer || '-';
  const userAgent = req.headers['user-agent'] || '-';
  const responseTime = tokens['response-time'](req, res);

  return `${addrShortened} ${tokens.date(req, res, 'iso')} ${req.method} ${
    res.statusCode
  } ${url} ${tokens.res(
    req,
    res,
    'content-length'
  )} "${referrer}" "${userAgent}" ${responseTime}ms`;
};

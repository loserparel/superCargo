var e = function () {
  try {
    return wx.getSystemInfoSync();
  } catch (e) { }
  return {};
}(), r = {
  app_client_id: "4",
  api_version: "9.2.0",
  app_version: "1.10.5",
  channel: "applet",
  model: e.model,
  brand: e.brand,
  version: e.version,
  system: e.system,
  platform: e.platform,
  SDKVersion: e.SDKVersion
};

module.exports = {
  COMMON: r
};
function toUserMessage(err) {
  if (!err) return "Unknown error";
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue || {})[0] || "field";
    return `${key} already exists`;
  }
  return err.message || "Error";
}

module.exports = { toUserMessage };
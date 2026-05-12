const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.sendMessage = async (req, res) => {
return notImplemented(res);
};

exports.getChatHistory = async (req, res) => {
return notImplemented(res);
};
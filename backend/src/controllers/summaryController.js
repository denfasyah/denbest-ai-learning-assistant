const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.generateSummary = async (req, res) => {
return notImplemented(res);
};

exports.getSummary = async (req, res) => {
return notImplemented(res);
};
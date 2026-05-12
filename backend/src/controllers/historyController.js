const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.getHistory = async (req, res) => {
return notImplemented(res);
};
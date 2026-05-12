const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.uploadDocument = async (req, res) => {
return notImplemented(res);
};

exports.getWorkspaceDocuments = async (req, res) => {
return notImplemented(res);
};

const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.createWorkspace = async (req, res) => {
return notImplemented(res);
};

exports.getUserWorkspaces = async (req, res) => {
return notImplemented(res);
};

exports.getWorkspaceDetail = async (req, res) => {
return notImplemented(res);
};

exports.updateWorkspace = async (req, res) => {
return notImplemented(res);
};

exports.deleteWorkspace = async (req, res) => {
return notImplemented(res);
};

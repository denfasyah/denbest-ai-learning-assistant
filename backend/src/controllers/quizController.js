const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.generateQuiz = async (req, res) => {
return notImplemented(res);
};

exports.getQuizzes = async (req, res) => {
return notImplemented(res);
};

exports.getQuizDetail = async (req, res) => {
return notImplemented(res);
};

exports.submitQuiz = async (req, res) => {
return notImplemented(res);
};
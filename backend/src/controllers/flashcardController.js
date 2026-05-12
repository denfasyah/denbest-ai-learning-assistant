const notImplemented = (res) => {
return res.status(501).json({
success: false,
message: "Not implemented yet",
});
};

exports.generateFlashcards = async (req, res) => {
return notImplemented(res);
};

exports.getFlashcards = async (req, res) => {
return notImplemented(res);
};

exports.reviewFlashcard = async (req, res) => {
return notImplemented(res);
};
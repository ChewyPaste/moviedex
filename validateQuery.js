function validateQuery(validQueries) {
	return (req, res, next) => {
		for (let key in req.query) {
			if (!validQueries.includes(key)) {
				return res
					.status(400)
					.send(
						`Your search query: "${key}" is not valid or is mispelled\nThe available search options are: "country", "avg_vote", and "genre"`
					);
			}
		}
		next();
	};
}

module.exports = validateQuery;

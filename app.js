require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./movies-data-small.json');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
//console.log(process.env.API_TOKEN);

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
	const authToken = req.get('Authorization');
	const apiToken = process.env.API_TOKEN;
	if (!authToken || authToken.split(' ')[1] !== apiToken) {
		return res.status(401).json({ error: 'Unauthorized request' });
	}
	next();
});

app.use((error, req, res, next) => {
	let response;
	if (process.env.NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
	} else {
		response = { error: { message: 'server error' } };
	}
	res.status(500).json(response);

	next();
});

function handleGetReq(req, res) {
	const { genre } = req.query;
	//const { country } = req.query;
	//const { avg_vote } = req.query;
	let results;

	// if (!genre) {
	// 	return res
	// 		.status(400)
	// 		.send('Please include a genre parameter with a value that is a string.');
	// }
	// if (genre.match(/[0-9]/g)) {
	// 	return res.status(400).send('Please use a value that is a string.');
	// }

	const searchResults = function () {
		if (genre) {
			results = MOVIEDEX.filter((movie) => movie.genre.toLowerCase() === genre);
		}
		if (req.query.country) {
			results = MOVIEDEX.filter((movie) =>
				movie.country.toLowerCase().includes(req.query.country.toLowerCase())
			);
		}

		if (req.query.avg_vote) {
			results = MOVIEDEX.filter(
				(movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
			);
		}
		return results;
	};

	res.json(searchResults()).send();
}

app.get('/movie', handleGetReq);

module.exports = app;

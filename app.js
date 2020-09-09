require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./movies-data-small.json');
const helmet = require('helmet');
const cors = require('cors');
const validateQuery = require('./validateQuery');
const { query } = require('express');
//const querystring = require('querystring');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// app.use((error, req, res, next) => {
// 	let response;
// 	if (process.env.NODE_ENV === 'production') {
// 		response = { error: { message: 'server error' } };
// 	} else {
// 		response = { error: { message: 'server error' } };
// 	}
// 	res.status(500).json(response);

app.use(function validateBearerToken(req, res, next) {
	const authToken = req.get('Authorization');
	const apiToken = process.env.API_TOKEN;
	if (!authToken || authToken.split(' ')[1] !== apiToken) {
		return res.status(401).json({ error: 'Unauthorized request' });
	}
	next();
});

const validGenres = [
	'animation',
	'drama',
	'romantic',
	'comedy',
	'spy',
	'crime',
	'thriller',
	'adventure',
	'documentary',
	'horror',
	'action',
	'western',
	'history',
	'biography',
	'musical',
	'fantasy',
	'war',
	'grotesque',
	''
];

function handleGetMovie(req, res) {
	let response = MOVIEDEX;
	const { genre } = req.query;
	const { country } = req.query;
	const { avg_vote } = req.query;

	if (genre && validGenres.includes(genre.toLowerCase())) {
		response = response.filter((movie) =>
			movie.genre.toLowerCase().includes(genre.toLowerCase())
		);
	}

	if (country) {
		response = response.filter((movie) =>
			movie.country.toLowerCase().includes(country.toLowerCase())
		);
	}

	if (avg_vote) {
		response = response.filter((movie) => {
			if (movie.avg_vote >= avg_vote) {
				return movie;
			}
		});
	}
	res.json(response);
}

app.get(
	'/movie',
	validateQuery(['country', 'avg_vote', 'genre']),
	handleGetMovie
);

module.exports = app;

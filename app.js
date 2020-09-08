require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIEDEX = require('./movies-data-small.json');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

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
	const { country } = req.query;
	const { avg_vote } = req.query;
	let results = [];

	const searchResults = function () {
		if (genre) {
			results.concat(
				MOVIEDEX.filter((movie) => movie.genre.toLowerCase() === genre)
			);
		}
		debugger;
		if (country) {
			results.concat(
				MOVIEDEX.filter((movie) =>
					movie.country.toLowerCase().includes(country.toLowerCase())
				)
			);
		}

		if (avg_vote) {
			results = MOVIEDEX.filter(
				(movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
			);
		}
		//console.log(results.flat());
		console.log(results);

		return results;
	};

	res.json(searchResults()).send();
}

app.get('/movie', handleGetReq);

module.exports = app;

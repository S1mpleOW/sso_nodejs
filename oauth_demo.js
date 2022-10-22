// client id 4b15783eefd0dddc418d
// client secret fa35eb72f73876fccf5ae1d0b4a767dca3669599
import * as dotenv from 'dotenv';
dotenv.config();
import open from 'open';
import express from 'express';
const app = express();
import fetch from 'node-fetch';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID || '4b15783eefd0dddc418d';
const CLIENT_SECRET =
	process.env.GITHUB_CLIENT_SECRET || 'fa35eb72f73876fccf5ae1d0b4a767dca3669599';
const AUTH_ENDPOINT = `https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}`;
const TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';
const USER_ENDPOINT = 'https://api.github.com/user';
let auth_code = null;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
app.get('/login/github/authorized', (req, _, next) => {
	auth_code = req.query.code;
	if (!auth_code) {
		throw new Error('Invalid code');
	}
	next();
	(async () => {
		const code = await fetch(TOKEN_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code: auth_code,
			}),
		});
		console.log(
			JSON.stringify({
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				code: auth_code,
			})
		);
		const token = await code.text();
		const access_token = token.split('&')[0].split('=')[1];
		const fetchUser = await fetch(USER_ENDPOINT, {
			headers: {
				Authorization: `token ${access_token}`,
			},
		});
		const user_data = await fetchUser.json();
		const username = user_data['login'];
		const email = user_data['email'];
		const company = user_data['company'];
		const bio = user_data['bio'];
		console.log(`Username: ${username}`);
		console.log(`Email: ${email}`);
		console.log(`Company: ${company}`);
		console.log(`Bio: ${bio}`);
	})();
});
open(AUTH_ENDPOINT);

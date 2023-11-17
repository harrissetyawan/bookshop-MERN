import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import morgan from "morgan";

const app = express();
app.use(morgan('combined'));
app.use(express.json());


app.get("/", (request, response) => {
	console.log(request);
	return response.status(234).send("Welcome To Bookstore");
});

app.post("/books", async (request, response) => {
	try {
		if (
			!request.body.title ||
			!request.body.author ||
			!request.body.publishYear
		) {
			return response.status(400).send({
				message: `Send All Fields!`,
			});
		}

		const newBook = {
			title: request.body.title,
			author: request.body.author,
			publishYear: request.body.publishYear,
		};

		const book = await Book.create(newBook);
		return response.status(201).send(book);
    
	} catch (error) {
		console.log(error.message);
		response.status(500).send({ message: error.message });
	}
});

mongoose
	.connect(mongoDBURL)
	.then(() => {
		console.info("DB Connected!");
		app.listen(PORT, () => {
			console.log(`Listening on PORT ${PORT}`);
		});
	})
	.catch((error) => {
		console.error(error);
	});
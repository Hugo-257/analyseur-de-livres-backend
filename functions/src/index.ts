const functions = require("firebase-functions");
import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const configuration = new Configuration({
	apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.get("/test", (req: Request, res: Response) => {
	res.send({ message: "Hello world" });
});

app.get("/models", async (req: Request, res: Response) => {
	const result = (await openai.listModels()).data;

	res.send(result);
});

app.post("/getWinnerSections", async (req: Request, res: Response) => {
	console.log(req.body.sections);

	try {
		let prompt =
			"Retourne les numeros des sections qui indiquent une fin avec victoire: ";

		const obj: { sections: string } = req.body;
		const { sections } = obj;
		prompt += "\n" + sections;

		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 2048,
		});
		
		let choicesString = completion.data.choices[0].text?.trim();

		const result = {
			result: choicesString,
		};

		res.send(result);
	} catch (e) {
		res.status(400);
		console.error(e);
		res.send({ error: "Something went wrong" });
	}
});

app.post("/queryDavinci", async (req: Request, res: Response) => {

	try {
		
		let { prompt } = req.body;

		const quest= "Réponds si oui ou non si c'est une  fin avec victoire : \n" + prompt;

		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: quest,
			max_tokens: 2048,
		});

		const result = {
			question: quest,
			result: completion.data,
		};

		console.log(result);

		res.send(result);
	} catch (e) {
		res.status(400);
		res.send({ error: (e as Error).message });
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log("Running on port :" + PORT);
});

exports.api = functions.region("europe-west1").https.onRequest(app);

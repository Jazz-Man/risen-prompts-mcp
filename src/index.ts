import { McpServer, Tool, Toolkit } from "@effect/ai";
import { BunRuntime, BunSink, BunStream } from "@effect/platform-bun";
import { Effect, Layer, Logger, Schema } from "effect";

const GetCurrentTime = Tool.make("GetCurrentTime", {
	description: "Повертає поточний час у форматі ISO",
	success: Schema.String,
});

const CalculateSum = Tool.make("CalculateSum", {
	description: "Обчислює суму масиву чисел",
	parameters: {
		numbers: Schema.Array(Schema.Number).annotations({
			description: "Масив чисел для обчислення суми",
		}),
	},
	success: Schema.Number,
});

const GenerateRandomNumber = Tool.make("GenerateRandomNumber", {
	description: "Генерує випадкове число в заданому діапазоні",
	parameters: {
		min: Schema.Number.annotations({
			description: "Мінімальне значення",
		}),
		max: Schema.Number.annotations({
			description: "Максимальне значення",
		}),
	},
	success: Schema.Number,
});

const ReverseString = Tool.make("ReverseString", {
	description: "Перевертає рядок задом наперед",
	parameters: {
		text: Schema.String.annotations({
			description: "Рядок для перевертання",
		}),
	},
	success: Schema.String,
});

const CustomToolkit = Toolkit.make(
	GetCurrentTime,
	CalculateSum,
	GenerateRandomNumber,
	ReverseString,
);

const CustomToolHandlers = CustomToolkit.toLayer(
	Effect.gen(function* () {
		return {
			// Обробник для get_current_time
			GetCurrentTime: () => Effect.succeed(new Date().toISOString()),

			// Обробник для calculate_sum
			CalculateSum: ({ numbers }) =>
				Effect.succeed(numbers.reduce((sum, num) => sum + num, 0)),

			// Обробник для generate_random_number
			GenerateRandomNumber: ({ min, max }) =>
				Effect.sync(() => Math.floor(Math.random() * (max - min + 1)) + min),

			// Обробник для reverse_string
			ReverseString: ({ text }) =>
				Effect.succeed(text.split("").reverse().join("")),
		};
	}),
);

const CreateUser = Tool.make("create_user", {
	description: "Створює нового користувача з опціональним підтвердженням",
	parameters: {
		username: Schema.String.annotations({
			description: "Ім'я користувача",
		}),
	},
	success: Schema.Struct({
		id: Schema.String,
		username: Schema.String,
		email: Schema.String,
		createdAt: Schema.String,
	}),
});

const UserToolkit = Toolkit.make(CreateUser);

const UserToolHandlers = UserToolkit.toLayer(
	Effect.succeed({
		create_user: ({ username }) => {
			// Генеруємо ID та створюємо користувача
			const userId = `user-${Date.now()}`;
			const email = `${username}@example.com`;

			return Effect.log(`Створено користувача: ${username} (${email})`).pipe(
				Effect.map(() => ({
					id: userId,
					username,
					email,
					createdAt: new Date().toISOString(),
				})),
			);
		},
	}),
);

// Merge all the resources and prompts into a single server layer
const ServerLayer = Layer.mergeAll(
	McpServer.toolkit(UserToolkit),
	McpServer.toolkit(CustomToolkit),
).pipe(
	Layer.provide(UserToolHandlers),
	Layer.provide(CustomToolHandlers),
	// Provide the MCP server implementation
	Layer.provide(
		McpServer.layerStdio({
			name: "Demo Server",
			version: "1.0.0",
			stdin: BunStream.stdin,
			stdout: BunSink.stdout,
		}),
	),
	// add a stderr logger
	Layer.provide(Logger.add(Logger.prettyLogger({ stderr: true }))),
);

Layer.launch(ServerLayer).pipe(BunRuntime.runMain);

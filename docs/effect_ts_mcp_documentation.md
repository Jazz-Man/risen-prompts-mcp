# Effect TS @effect/ai - MCP Server Documentation

## Overview

The `@effect/ai` package provides a comprehensive implementation of the Model Context Protocol (MCP), which enables AI models to interact with external tools and resources. MCP (Model Context Protocol) is an open protocol that allows AI applications to connect to specialized servers that provide additional tools, context, and resources.

The Effect TS MCP implementation leverages the functional programming principles of the Effect ecosystem to provide type-safe, composable, and reliable MCP server functionality.

## Core Components

### McpServer Class

The `McpServer` class is the central component for creating Model Context Protocol servers:

```ts
declare class McpServer
```

This class provides the foundation for implementing MCP servers that can register tools, resources, and prompts for AI models to interact with.

### McpServer.run

Starts the MCP server with basic configuration:

```ts
declare const run: (options: {
  readonly name: string
  readonly version: string
}) => Effect.Effect<never, never, McpServer | RpcServer.Protocol>
```

**Parameters:**
- `name`: The name of the MCP server
- `version`: The version of the MCP server

**Returns:** An Effect that produces the McpServer instance or RpcServer.Protocol

### McpServer.layer

Creates a Layer for the MCP server:

```ts
declare const layer: (options: {
  readonly name: string
  readonly version: string
}) => Layer.Layer<McpServer | McpServerClient, never, RpcServer.Protocol>
```

## Server Transport Implementations

### McpServer.layerStdio

Runs the MCP server using stdio for input and output:

```ts
declare const layerStdio: <EIn, RIn, EOut, ROut>(options: {
  readonly name: string
  readonly version: string
  readonly stdin: Stream<Uint8Array, EIn, RIn>
  readonly stdout: Sink<unknown, Uint8Array | string, unknown, EOut, ROut>
}) => Layer.Layer<McpServer | McpServerClient, never, RIn | ROut>
```

**Example Usage:**
```ts
import { McpSchema, McpServer } from "@effect/ai"
import { NodeRuntime, NodeSink, NodeStream } from "@effect/platform-node"
import { Effect, Layer, Logger, Schema } from "effect"

const idParam = McpSchema.param("id", Schema.NumberFromString)

// Define a resource template for a README file
const ReadmeTemplate = McpServer.resource`file://readme/${idParam}`({
  name: "README Template",
  // You can add auto-completion for the ID parameter
  completion: {
    id: (_) => Effect.succeed([1, 2, 3, 4, 5])
  },
  content: Effect.fn(function*(_uri, id) {
    return `# MCP Server Demo - ID: ${id}`
  })
})

// Define a test prompt with parameters
const TestPrompt = McpServer.prompt({
  name: "Test Prompt",
  description: "A test prompt to demonstrate MCP server capabilities",
  parameters: Schema.Struct({
    flightNumber: Schema.String
  }),
  completion: {
    flightNumber: () => Effect.succeed(["FL123", "FL456", "FL789"])
  },
  content: ({ flightNumber }) => Effect.succeed(`Get the booking details for flight number: ${flightNumber}`)
})

// Merge all the resources and prompts into a single server layer
const ServerLayer = Layer.mergeAll(
  ReadmeTemplate,
  TestPrompt
).pipe(
  // Provide the MCP server implementation
  Layer.provide(McpServer.layerStdio({
    name: "Demo Server",
    version: "1.0.0",
    stdin: NodeStream.stdin,
    stdout: NodeSink.stdout
  })),
  // add a stderr logger
  Layer.provide(Logger.add(Logger.prettyLogger({ stderr: true })))
)

Layer.launch(ServerLayer).pipe(NodeRuntime.runMain)
```

### McpServer.layerHttp

Runs the MCP server using HTTP for input and output:

```ts
declare const layerHttp: <I = HttpRouter.Default>(options: {
  readonly name: string
  readonly version: string
  readonly path: HttpRouter.PathInput
  readonly routerTag?: HttpRouter.HttpRouter.TagClass<I, string, any, any>
}) => Layer.Layer<McpServer | McpServerClient>
```

**Example Usage:**
```ts
import { McpSchema, McpServer } from "@effect/ai"
import { HttpRouter } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Schema } from "effect"
import { createServer } from "node:http"

const idParam = McpSchema.param("id", Schema.NumberFromString)

// Define a resource template for a README file
const ReadmeTemplate = McpServer.resource`file://readme/${idParam}`({
  name: "README Template",
  // You can add auto-completion for the ID parameter
  completion: {
    id: (_) => Effect.succeed([1, 2, 3, 4, 5])
  },
  content: Effect.fn(function*(_uri, id) {
    return `# MCP Server Demo - ID: ${id}`
  })
})

// Define a test prompt with parameters
const TestPrompt = McpServer.prompt({
  name: "Test Prompt",
  description: "A test prompt to demonstrate MCP server capabilities",
  parameters: Schema.Struct({
    flightNumber: Schema.String
  }),
  completion: {
    flightNumber: () => Effect.succeed(["FL123", "FL456", "FL789"])
  },
  content: ({ flightNumber }) => Effect.succeed(`Get the booking details for flight number: ${flightNumber}`)
})

// Merge all the resources and prompts into a single server layer
const ServerLayer = Layer.mergeAll(
  ReadmeTemplate,
  TestPrompt,
  HttpRouter.Default.serve()
).pipe(
  // Provide the MCP server implementation
  Layer.provide(McpServer.layerHttp({
    name: "Demo Server",
    version: "1.0.0",
    path: "/mcp"
  })),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(ServerLayer).pipe(NodeRuntime.runMain)
```

### McpServer.layerHttpRouter

Runs the MCP server using HTTP with a specific router:

```ts
declare const layerHttpRouter: (options: {
  readonly name: string
  readonly version: string
  readonly path: HttpRouter.PathInput
}) => Layer.Layer<
  McpServer | McpServerClient,
  never,
  HttpLayerRouter.HttpRouter
>
```

## Resource Management

### McpServer.resource

Registers a resource with the MCP server. This function has two overloads:

**Static URI Resource:**
```ts
declare const resource: <E, R>(options: {
  readonly uri: string
  readonly name: string
  readonly description?: string | undefined
  readonly mimeType?: string | undefined
  readonly audience?: ReadonlyArray<"user" | "assistant"> | undefined
  readonly priority?: number | undefined
  readonly content: Effect.Effect<
    typeof ReadResourceResult.Type | string | Uint8Array,
    E,
    R
  >
}) => Layer.Layer<never, never, Exclude<R, McpServerClient>>
```

**Template URI Resource:**
```ts
declare const resource: <const Schemas extends ReadonlyArray<Schema.Schema.Any>>(
  segments: TemplateStringsArray,
  ...schemas: Schemas & {
    readonly [K in keyof Schemas]: Schema.Schema.Encoded<
      Schemas[K]
    > extends string
      ? unknown
      : "Schema must be encodable to a string"
  }
) => <E, R, const Completions extends Partial<ResourceCompletions<Schemas>> = {}>(
  options: {
    readonly name: string
    readonly description?: string | undefined
    readonly mimeType?: string | undefined
    readonly audience?: ReadonlyArray<"user" | "assistant"> | undefined
    readonly priority?: number | undefined
    readonly completion?:
      | ValidateCompletions<Completions, keyof ResourceCompletions<Schemas>>
      | undefined
    readonly content: (
      uri: string,
      ...params: { readonly [K in keyof Schemas]: Schemas[K]["Type"] }
    ) => Effect.Effect<
      typeof ReadResourceResult.Type | string | Uint8Array,
      E,
      R
    >
  }) => Layer.Layer<
    never,
    never,
    | Exclude<
        | R
        | (Completions[keyof Completions] extends (input: string) => infer Ret
            ? Ret extends Effect.Effect<infer _A, infer _E, infer _R>
              ? _R
              : never
            : never),
        McpServerClient
      >
    | McpServer
  >
```

### McpServer.registerResource

Imperative version of resource registration:

```ts
declare const registerResource: {
  <E, R>(options: {
    readonly uri: string
    readonly name: string
    readonly description?: string | undefined
    readonly mimeType?: string | undefined
    readonly audience?: ReadonlyArray<"user" | "assistant"> | undefined
    readonly priority?: number | undefined
    readonly content: Effect.Effect<
      typeof ReadResourceResult.Type | string | Uint8Array,
      E,
      R
    >
  }): Effect.Effect<void, never, Exclude<R, McpServerClient> | McpServer>
  <const Schemas extends ReadonlyArray<Schema.Schema.Any>>(
    segments: TemplateStringsArray,
    ...schemas: Schemas & {
      readonly [K in keyof Schemas]: Schema.Schema.Encoded<
        Schemas[K]
      > extends string
        ? unknown
        : "Schema must be encodable to a string"
    }
  ): <E, R, const Completions extends Partial<ResourceCompletions<Schemas>> = {}>(
    options: {
      readonly name: string
      readonly description?: string | undefined
      readonly mimeType?: string | undefined
      readonly audience?: ReadonlyArray<"user" | "assistant"> | undefined
      readonly priority?: number | undefined
      readonly completion?:
        | ValidateCompletions<Completions, keyof ResourceCompletions<Schemas>>
        | undefined
      readonly content: (
        uri: string,
        ...params: { readonly [K in keyof Schemas]: Schemas[K]["Type"] }
      ) => Effect.Effect<
        typeof ReadResourceResult.Type | string | Uint8Array,
        E,
        R
      >
    }) => Effect.Effect<
      void,
      never,
      | Exclude<
          | R
          | (Completions[keyof Completions] extends (input: string) => infer Ret
              ? Ret extends Effect.Effect<infer _A, infer _E, infer _R>
                ? _R
                : never
              : never),
          McpServerClient
        >
      | McpServer
    >
}
```

## Prompt Management

### McpServer.prompt

Registers a prompt with the MCP server:

```ts
declare const prompt: <
  E,
  R,
  Params = {},
  ParamsI extends Record<string, string> = {},
  ParamsR = never,
  const Completions extends {
    readonly [K in keyof Params]?: (
      input: string,
    ) => Effect.Effect<Array<Params[K]>, any, any>
  } = {},
>(options: {
  readonly name: string
  readonly description?: string | undefined
  readonly parameters?: Schema.Schema<Params, ParamsI, ParamsR> | undefined
  readonly completion?:
    | ValidateCompletions<Completions, Extract<keyof Params, string>>
    | undefined
  readonly content: (
    params: Params,
  ) => Effect.Effect<Array<typeof PromptMessage.Type> | string, E, R>
}) => Layer.Layer<never, never, Exclude<ParamsR | R, McpServerClient>>
```

### McpServer.registerPrompt

Imperative version of prompt registration:

```ts
declare const registerPrompt: <
  E,
  R,
  Params = {},
  ParamsI extends Record<string, string> = {},
  ParamsR = never,
  const Completions extends {
    readonly [K in keyof Params]?: (
      input: string,
    ) => Effect.Effect<Array<Params[K]>, any, any>
  } = {},
>(options: {
  readonly name: string
  readonly description?: string | undefined
  readonly parameters?: Schema.Schema<Params, ParamsI, ParamsR> | undefined
  readonly completion?:
    | ValidateCompletions<Completions, Extract<keyof Params, string>>
    | undefined
  readonly content: (
    params: Params,
  ) => Effect.Effect<Array<typeof PromptMessage.Type> | string, E, R>
}) => Effect.Effect<
  void,
  never,
  Exclude<ParamsR | R, McpServerClient> | McpServer
>
```

## Tool Management

### McpServer.toolkit

Registers an AiToolkit with the MCP server:

```ts
declare const toolkit: <Tools extends Record<string, AiTool.Any>>(
  toolkit: Toolkit.Toolkit<Tools>,
) => Layer.Layer<
  never,
  never,
  | AiTool.HandlersFor<Tools>
  | Exclude<AiTool.Requirements<Tools>, McpServerClient>
>
```

### McpServer.registerToolkit

Imperative version of toolkit registration:

```ts
declare const registerToolkit: <Tools extends Record<string, AiTool.Any>>(
  toolkit: Toolkit.Toolkit<Tools>,
) => Effect.Effect<
  void,
  never,
  | McpServer
  | AiTool.HandlersFor<Tools>
  | Exclude<AiTool.Requirements<Tools>, McpServerClient>
>
```

### Provider-Defined Tools

The Tool module now supports provider-defined tools, which are tools built into LLM providers (like web search, code execution) rather than user-defined tools. These tools are executed by the LLM provider rather than your application, but can optionally require custom handlers implemented in your application to process provider-generated results.

**Example Usage:**
```ts
import { Tool } from "@effect/ai"
import { Schema } from "effect"

// Define a web search tool provided by OpenAI
const WebSearch = Tool.providerDefined({
  id: "openai.web_search",
  toolkitName: "WebSearch",
  providerName: "web_search",
  args: {
    query: Schema.String
  },
  success: Schema.Struct({
    results: Schema.Array(Schema.Struct({
      title: Schema.String,
      url: Schema.String,
      snippet: Schema.String
    }))
  })
})
```

### Enhanced Tool Annotations

Tools now support enhanced annotations for better metadata management:

- **Title**: Human-readable title for tools
- **Readonly**: Indicates whether a tool only reads data without making changes
- **Destructive**: Indicates whether a tool performs destructive operations
- **Idempotent**: Indicates whether a tool can be called multiple times safely
- **OpenWorld**: Indicates whether a tool can handle arbitrary external data

**Example Usage:**
```ts
import { Tool } from "@effect/ai"

const readOnlyTool = Tool.make("get_user_info")
  .annotate(Tool.Readonly, true)

const safeTool = Tool.make("search_database")
  .annotate(Tool.Destructive, false)

const idempotentTool = Tool.make("get_current_time")
  .annotate(Tool.Idempotent, true)
```

### Tool Failure Modes

Tools now support configurable failure modes:

- **"error"** (default): Errors during tool execution are returned in the error channel
- **"return"**: Errors during tool execution are captured and returned as part of the tool call result

**Example Usage:**
```ts
const safeTool = Tool.make("risky_operation", {
  failureMode: "return", // Errors will be returned as part of the result
  success: Schema.Struct({
    success: Schema.Boolean,
    data: Schema.Option(Schema.String),
    error: Schema.Option(Schema.String)
  })
})
```

## Elicitation

### McpServer.elicit

Creates an elicitation request to get information from the client:

```ts
declare const elicit: <A, I extends Record<string, any>, R>(options: {
  readonly message: string
  readonly schema: Schema.Schema<A, I, R>
}) => Effect.Effect<A, ElicitationDeclined, McpServerClient | R>
```

The elicit function now has enhanced error handling and properly manages different user responses:

- **Accept**: User accepted the request and provided content matching the requested schema
- **Cancel**: User canceled the request without providing content
- **Decline**: User explicitly declined the request

**Example Usage:**
```ts
import { McpServer, McpSchema } from "@effect/ai"
import { Effect, Schema } from "effect"

// Define a schema for the data you want to elicit
const UserDataSchema = Schema.Struct({
  name: Schema.String,
  email: Schema.String,
  age: Schema.Number
})

// Use elicit to request information from the client
const getUserData = Effect.gen(function*() {
  const userData = yield* McpServer.elicit({
    message: "Please provide your user information",
    schema: UserDataSchema
  })
  
  return userData
})
```

### ElicitationDeclined

Error type for when elicitation is declined, with detailed information about the request and potential cause:

```ts
declare class ElicitationDeclined
```

## Protocol Version Updates

The MCP protocol has been updated to version "2025-06-18" with support for multiple protocol versions:

- "2025-06-18" (latest)
- "2025-03-26"
- "2024-11-05"
- "2024-10-07"

This ensures backward compatibility while supporting the latest features.

## Schema Utilities

### McpSchema.param

Helper to create a parameter for a resource URI template:

```ts
declare const param: <const Id extends string, S extends Schema.Schema.Any>(
  id: Id,
  schema: S,
) => Param<Id, S>
```

### McpSchema.Param

Interface for parameters:

```ts
export interface Param<Id extends string, S extends Schema.Schema.Any>
  extends Schema.Schema<S["Type"], S["Encoded"], S["Context"]> {
  readonly [ParamAnnotation]: Id
}
```

## Type Definitions

### ValidateCompletions

Type for validating completion functions:

```ts
type ValidateCompletions<Completions, Keys> = Completions & {
  readonly [K in keyof Completions]: K extends Keys
    ? (input: string) => any
    : never
}
```

### ResourceCompletions

Type for resource completion functions:

```ts
type ResourceCompletions<Schemas> = {
  readonly [K in Extract<
    keyof Schemas,
    `${number}`
  > as Schemas[K] extends Param<infer Id, infer _S> ? Id : `param${K}`]: (
    input: string,
  ) => Effect.Effect<Array<Schema.Schema.Type<Schemas[K]>>, any, any>
}
```

## Client and Error Types

### McpServerClient

The client interface for MCP server communication:

```ts
declare class McpServerClient
```

### ElicitationDeclined

Error type for when elicitation is declined:

```ts
declare class ElicitationDeclined
```

## Key Concepts

### Model Context Protocol (MCP)

MCP is an open protocol that enables seamless integration between LLM applications and external data sources and tools. It allows AI models to request context, resources, and tools from specialized servers.

### Resource Templates

Resource templates allow you to define parameterized resources that can be accessed by URI patterns. For example, `file://readme/${idParam}` creates a template where the `id` parameter can be filled in dynamically.

### Prompt Templates

Prompt templates allow you to define parameterized prompts that can be customized at runtime. This enables AI models to request specific information with appropriate parameters.

### Completion Functions

Completion functions provide auto-completion suggestions for parameters, making it easier for users to provide appropriate values when using resources or prompts.

## Usage Patterns

### Building an MCP Server

1. Define your resources using `McpServer.resource` with template parameters
2. Define your prompts using `McpServer.prompt` with parameters
3. Register toolkits using `McpServer.toolkit`
4. Create the server layer using `McpServer.layerStdio` or `McpServer.layerHttp`
5. Launch the server using `Layer.launch`

### Resource Registration Pattern

```ts
const idParam = McpSchema.param("id", Schema.NumberFromString)

const MyResource = McpServer.resource`https://api.example.com/data/${idParam}`({
  name: "Example Data Resource",
  description: "Provides example data based on ID",
  completion: {
    id: (input) => Effect.succeed([1, 2, 3, 4, 5]) // Auto-completion options
  },
  content: (uri, id) => 
    Effect.tryPromise({
      try: () => fetch(uri).then(res => res.text()),
      catch: () => new Error(`Failed to fetch resource: ${uri}`)
    })
})
```

### Prompt Registration Pattern

```ts
const MyPrompt = McpServer.prompt({
  name: "Data Query Prompt",
  description: "Prompt for querying specific data",
  parameters: Schema.Struct({
    dataType: Schema.String,
    dateRange: Schema.String
  }),
  completion: {
    dataType: () => Effect.succeed(["users", "orders", "products"]),
    dateRange: () => Effect.succeed(["last-week", "last-month", "last-year"])
  },
  content: ({ dataType, dateRange }) => 
    Effect.succeed(`Please provide data for ${dataType} in the ${dateRange} period.`)
})
```

## Additional Capabilities

### Roots Support

The MCP protocol now supports roots, which allow servers to request specific directories or files from clients to operate on. This is particularly useful for file system operations and repository access.

**Root Capabilities:**
- Clients can support listing roots with the `roots` capability
- Support for notifications when the roots list changes
- Servers can request root URIs from clients using the `roots/list` RPC

### Sampling Support

The protocol now supports sampling capabilities, allowing servers to request LLM sampling from clients. This enables more sophisticated AI interactions where the server can request the client to perform additional AI processing.

**Sampling Capabilities:**
- Clients can support sampling with the `sampling` capability
- Support for model selection hints and preferences
- Configurable parameters like temperature, max tokens, and stop sequences

### Enhanced Client Capabilities

The protocol now includes more comprehensive client capabilities:

```ts
export class ClientCapabilities extends Schema.Class<ClientCapabilities>(
  "@effect/ai/McpSchema/ClientCapabilities"
)({
  experimental: Schema.optional(Schema.Record({
    key: Schema.String,
    value: Schema.Struct({})
  })),
  roots: Schema.optional(Schema.Struct({
    listChanged: Schema.optional(Schema.Boolean)
  })),
  sampling: Schema.optional(Schema.Struct({})),
  elicitation: Schema.optional(Schema.Struct({}))
})
```

## Architecture Benefits

1. **Type Safety**: Leverages Effect's Schema system for compile-time type safety
2. **Composability**: Uses Effect's Layer system for composable server configuration
3. **Transport Agnostic**: Supports both stdio and HTTP transports
4. **Auto-completion**: Built-in support for parameter auto-completion
5. **Standard Protocol**: Implements the open Model Context Protocol standard
6. **Enhanced Interactivity**: Supports elicitation for interactive user input
7. **Provider Integration**: Supports provider-defined tools for advanced capabilities
8. **Flexible Architecture**: Supports roots and sampling for comprehensive AI workflows

This comprehensive MCP server implementation allows you to build sophisticated AI applications that can interact with external tools and resources in a standardized, type-safe manner using the Effect ecosystem.
# MCP Prompt Optimizer Analysis and TypeScript Rewrite Planning

## Objective
Analyze the Python MCP Prompt Optimizer project located in `tmp/mcp-prompt-optimizer` and its documentation in `tmp/mcp-prompt-optimizer/README.md` to understand the project's functionality, architecture, and usage patterns. Use all available Serena MCP utilities for comprehensive analysis.

## Analysis Requirements

### 1. Codebase Analysis
- **Functional Analysis**: Examine all Python source files to understand the complete functionality of the MCP Prompt Optimizer
- **Code Examples**: Identify and analyze any example code, usage patterns, and implementation details
- **Dependencies**: Document all Python dependencies and their roles in the system
- **Entry Points**: Identify main entry points, command-line interfaces, and API endpoints

### 2. Documentation Analysis
- **README Review**: Thoroughly analyze the README.md file for project purpose, usage instructions, and configuration details
- **Configuration Files**: Examine any configuration files, setup scripts, or deployment configurations
- **Example Usage**: Document all provided examples and use cases

## Business Logic Documentation (Language-Agnostic)

Create a comprehensive, structured description of the business logic without programming language dependencies:

### Core Components:
- **Prompt Optimization Engine**: Document the core algorithms and processes for optimizing prompts
- **Template Management**: Describe the system for managing and applying prompt templates
- **Analysis Framework**: Detail the methods for analyzing prompt effectiveness
- **Optimization Strategies**: Document all implemented optimization techniques and patterns
- **Data Processing**: Describe how input/output data is processed and transformed

### Business Rules:
- **Input Validation**: Document validation rules and constraints
- **Processing Logic**: Detail the step-by-step processing workflows
- **Error Handling**: Describe error conditions and recovery mechanisms
- **Performance Considerations**: Document performance requirements and optimization targets

## Architecture Documentation (Language-Agnostic)

Create a structured architectural description using pseudocode where appropriate:

### System Components:
- **Service Layer**: Document service interfaces and responsibilities
- **Data Layer**: Describe data storage, retrieval, and management patterns
- **Processing Layer**: Detail the processing pipeline architecture
- **Interface Layer**: Document API interfaces and communication patterns

### Design Patterns:
- **Modularity**: Describe component relationships and dependencies
- **Scalability**: Document scaling considerations and patterns
- **Security**: Outline security measures and access controls
- **Extensibility**: Describe extension points and plugin architectures

### Pseudocode Examples:
Provide pseudocode representations for critical algorithms and processes to ensure clear understanding of implementation requirements.

## Prompt Templates Documentation

Extract and document all prompt templates used in the Python codebase:

### Template Categories:
- **Optimization Templates**: All templates used for prompt optimization
- **Analysis Templates**: Templates used for analyzing prompt effectiveness
- **Generation Templates**: Templates for generating optimized prompts
- **Validation Templates**: Templates for validating prompt quality

### Template Structure:
- **Variables**: Document all template variables and their purposes
- **Logic**: Describe conditional logic within templates
- **Formatting**: Document formatting rules and constraints
- **Usage Contexts**: Describe when and how each template is applied

## TypeScript Rewrite Specifications

### Target Architecture:
- **Effect TS Integration**: Plan integration with `@effect/ai` package and McpServer
- **Type Safety**: Leverage TypeScript's type system for enhanced reliability
- **Functional Programming**: Apply Effect TS functional programming patterns
- **MCP Protocol**: Ensure proper MCP protocol implementation

### Migration Strategy:
- **Component Mapping**: Map Python components to TypeScript equivalents
- **Dependency Translation**: Plan translation of Python dependencies to TypeScript ecosystem
- **API Compatibility**: Ensure API compatibility where required
- **Performance Optimization**: Plan performance improvements in the TypeScript version

## Deliverables

### 1. Business Logic Specification
- Comprehensive, language-agnostic description of all business logic
- Clear process flows and decision points
- Input/output specifications
- Error handling procedures

### 2. Architectural Specification
- High-level system architecture diagram
- Component interaction patterns
- Data flow descriptions
- Interface specifications

### 3. Prompt Template Catalog
- Complete catalog of all prompt templates
- Usage scenarios and contexts
- Template parameters and constraints
- Optimization strategies applied

### 4. TypeScript Migration Plan
- Detailed component mapping from Python to TypeScript
- Implementation timeline and phases
- Risk assessment and mitigation strategies
- Testing and validation approach

## Analysis Methodology

1. **Comprehensive Code Review**: Analyze every Python file for complete understanding
2. **Dependency Mapping**: Document all external libraries and their usage
3. **Use Case Identification**: Identify all documented and implied use cases
4. **Performance Analysis**: Document performance characteristics and requirements
5. **Security Review**: Identify security considerations and requirements

## Quality Standards

- **Completeness**: Ensure all functionality is documented
- **Clarity**: Use clear, unambiguous language
- **Accuracy**: Verify all technical details
- **Organization**: Structure information logically
- **Actionability**: Provide clear guidance for TypeScript implementation
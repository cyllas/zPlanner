# zPlanner v1.4.0

zPlanner is a command-line tool developed to assist in project planning and management, with a special focus on software development projects. The project was born from the need to have a simple yet powerful tool that would allow project management directly from the terminal, without the need for complex graphical interfaces.

One of zPlanner's main differentiators is its ability to function as a memory system for AI-assisted development in IDEs with prompt capabilities. By maintaining a structured and hierarchical project record, ZPlanner helps preserve development context, allowing AI assistants to better understand the project's structure, history, and current state, resulting in more accurate and contextualized suggestions and assistance.

[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://www.npmjs.com/package/zplanner)
[![License](https://img.shields.io/npm/l/zplanner.svg)](https://github.com/cyllas/zPlanner/blob/main/LICENSE)
[![Node Version](https://img.shields.io/node/v/zplanner.svg)](https://nodejs.org)

## Purpose

zPlanner was created with the following objectives:

1. **Simplicity**: Enable project management directly from the terminal
2. **Efficiency**: Minimize time spent on administrative tasks
3. **Flexibility**: Adapt to different project types and methodologies
4. **Visualization**: Generate clear and responsive HTML reports
5. **Traceability**: Maintain progress history and updates
6. **AI Context**: Function as a memory system for AI-assisted development, maintaining structured project context

### AI First Design

zPlanner was designed with modern AI-assisted development in mind:

- **Context Preservation**: Maintains a structured history that serves as memory for AI assistants
- **Hierarchical Structure**: Organization that facilitates project understanding by AI systems
- **Change Tracking**: Allows AI assistants to understand project evolution
- **Clear Documentation**: Standardized format that improves interpretation by AI systems

## Features

### Project Management

- Project creation and configuration
- Hierarchical structure (phases, tasks, and subtasks)
- Automatic progress calculation
- Responsive HTML export
- Update date tracking

### Phase Organization

- Project phase creation
- Phase reordering
- Phase renaming
- Phase removal
- Progress calculation per phase

### Task Management

- Main task addition
- Subtask creation
- Completion marking
- Description updates
- Task removal

### HTML Reports

- Modern and responsive design
- Clear hierarchy visualization
- Progress indicators
- Update history
- Professional styling with BEM CSS

## Installation

```bash
npm install -g zplanner
```

## Usage Guide

### Basic Commands

#### Project Management

```bash
# Initialize new project
zplanner init "Project Name"

# List project structure
zplanner list

# Export HTML report
zplanner export ./path/report.html
```

#### Phase Management

```bash
# Add phase
zplanner add-phase "Phase Name"

# Rename phase
zplanner rename-phase "Current Name" "New Name"

# Move phase
zplanner move-phase "Phase Name" 2

# Remove phase
zplanner remove-phase "Phase Name"
```

#### Task Management

```bash
# Add task
zplanner add-task "Phase" "1.1" "Task Description"

# Add subtask
zplanner add-subtask "Phase" "1.1" "1.1.1" "Subtask Description"

# Mark as complete
zplanner complete "Phase" "1.1"

# Update description
zplanner update-task "Phase" "1.1" "New Description"

# Remove task
zplanner remove-task "Phase" "1.1"
```

## Project Structure

The project is organized as follows:

```
zPlanner/
├── src/
│   ├── cli.ts                 # Command-line interface
│   ├── index.ts              # Main entry point
│   ├── ProjectPlanner.ts     # Core project management
│   ├── config/              # Project configurations
│   ├── services/            # Business services
│   │   ├── PhaseService.ts  # Phase management
│   │   ├── TaskService.ts   # Task management
│   │   └── progress/        # Progress calculation
│   └── templates/           # HTML and CSS templates
├── dist/                    # Compiled code
└── docs/                    # Documentation
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

### Environment Setup

```bash
# Clone repository
git clone https://github.com/cyllas/zPlanner.git

# Install dependencies
cd zPlanner
npm install

# Run tests
npm test

# Start development mode
npm run dev
```

## Configuration

The `settings.ts` file allows configuration of:

```typescript
export const settings = {
  defaultLanguage: "en-US",
  dateFormat: "MM/DD/YYYY",
  timeZone: "UTC",
  projectDefaults: {
    outputFormat: "html",
    indentSize: 2,
  },
  repository: {
    url: "https://github.com/cyllas/zPlanner",
  },
  version: "1.4.0",
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

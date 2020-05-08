// imports
import log from "loglevel";
import chalk from "chalk";
// define types
export type LogLevel = "trace" | "debug" | "warn" | "error" | "silent" | "info";
export interface Log {
    trace(message: string, ...args: any): void;
    debug(message: string, ...args: any): void;
    info(message: string, ...args: any): void;
    warn(message: string, ...args: any): void;
    error(message: string, ...args: any): void;
}
// constants

const LogColor: Record<string, string> = {
    trace: '#888888',
    debug: '#588af7',
    info: '#bfc6ce',
    warn: '#fadda6',
    error: '#f08784',
  };

// class definition
export class Logger {
    constructor(logLevel: LogLevel) {
        // initialize logger
        log.setLevel(logLevel, false);
        // apply custom formatter
        const methodFactory = log.methodFactory;
        log.methodFactory = (methodName: string, level, loggerName) => {
            const logFunction = methodFactory(methodName, level, loggerName);
            return function(message) {
                // extract arguments
                const args: any[] = [];
                for (let i = 1; i < arguments.length; ++i) {
                    args.push(arguments[i]);
                }
                // check for browser vs server side for color and formatting
                if (typeof window === 'undefined') {
                    logFunction.apply(undefined, [
                        `${chalk.hex(LogColor[methodName]).bold(`[${loggerName}]:`)} ${chalk.hex(LogColor[methodName])(`${message}`)}`,
                        ...args
                    ]);
                } else {
                    logFunction.apply(undefined, [
                        `%c[${[loggerName]}] %c${message}`,
                        `color: ${LogColor[methodName]};font-weight: bold;`,
                        `color: ${LogColor[methodName]}`,
                        ...args
                    ]);
                };
            };
        };
    }
    getLogger(name: string): Log {
        return log.getLogger(name);
    }
}
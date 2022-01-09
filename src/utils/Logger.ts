import { Signale } from "signale";

export const  logger = new Signale({
    scope: "advent-of-code",
    types: {
        santa: {
            badge: "🎅",
            color: "red",
            label: "santa",
            logLevel: "info",
        },
        choice: {
            badge: "🔹",
            color: "blue",
            label: "choice",
            logLevel: "info",
        }
    },
});

export const  interactiveLogger = new Signale({
    scope: "advent-of-code",
    interactive: true,
    types: {
        santa: {
            badge: "🎅",
            color: "red",
            label: "santa",
            logLevel: "info",
        },
        choice: {
            badge: "🔹",
            color: "blue",
            label: "choice",
            logLevel: "info",
        }
    },
});

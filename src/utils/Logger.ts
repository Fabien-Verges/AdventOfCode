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
    },
});

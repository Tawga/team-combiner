import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getCmvLeftColor = (
    cmvLeft: number | undefined,
    maxVal: number = 100,
): { border: string; text: string } => {
    if (cmvLeft === undefined) {
        return { border: "hsl(var(--border))", text: "hsl(var(--foreground))" };
    }

    // Fraction: 0 = Full Cap Used (Good/Green), 1 = Min Cap Used (Bad/Red)
    const fraction = Math.max(0, Math.min(1, cmvLeft / maxVal));

    const green = [134, 216, 117];
    const yellow = [252, 246, 164];
    const red = [239, 68, 68];

    let r, g, b;

    if (fraction <= 0.5) {
        const f = fraction / 0.5;
        r = green[0] + f * (yellow[0] - green[0]);
        g = green[1] + f * (yellow[1] - green[1]);
        b = green[2] + f * (yellow[2] - green[2]);
    } else {
        const f = (fraction - 0.5) / 0.5;
        r = yellow[0] + f * (red[0] - yellow[0]);
        g = yellow[1] + f * (red[1] - yellow[1]);
        b = yellow[2] + f * (red[2] - yellow[2]);
    }

    const border = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    // Make text darker but still keep the color visible (e.g. 45% of original brightness)
    const text = `rgba(14, 13, 13, 0.88)`;

    return { border, text };
};

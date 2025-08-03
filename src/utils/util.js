export const getCmvLeftColor = (cmvLeft) => {
	// Define our key colors in [R, G, B] format
	const green = [134, 216, 117]; // A nice green
	const yellow = [252, 246, 164]; // The yellow from your original code
	const red = [239, 68, 68]; // A clear red

	let r, g, b;

	// Clamp the value to be within our 0-100 range for the gradient
	const clampedCmv = Math.max(0, Math.min(100, cmvLeft));

	if (clampedCmv <= 50) {
		// Calculate the interpolation factor (from 0.0 to 1.0) between green and yellow
		const factor = clampedCmv / 50;
		// Interpolate each color channel
		r = green[0] + factor * (yellow[0] - green[0]);
		g = green[1] + factor * (yellow[1] - green[1]);
		b = green[2] + factor * (yellow[2] - green[2]);
	} else {
		// Calculate the interpolation factor (from 0.0 to 1.0) between yellow and red
		const factor = (clampedCmv - 50) / 50;
		// Interpolate each color channel
		r = yellow[0] + factor * (red[0] - yellow[0]);
		g = yellow[1] + factor * (red[1] - yellow[1]);
		b = yellow[2] + factor * (red[2] - yellow[2]);
	}

	// Return the final color as an rgba string with some transparency
	return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.8)`;
};

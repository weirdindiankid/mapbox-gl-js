uniform float u_fade_t;
uniform sampler2D u_image0;
uniform sampler2D u_image1;
uniform sampler2D u_image2;
varying vec2 v_pos0;
varying vec2 v_pos1;

void main() {
	vec4 color0 = texture2D(u_image0, v_pos0);
    vec4 color1 = texture2D(u_image1, v_pos1);
    vec4 color = mix(color0, color1, u_fade_t);

	float elevation = -10030.0 + (
		(
			color.r * 256.0 * 256.0 * 256.0 +
			color.g * 256.0 * 256.0 +
			color.b * 256.0
		)
		* 0.1
	);

	float color_bar_height = 1317.0;
	float bottom_gap = 1000.0 / color_bar_height;

	float height = elevation * 0.0001;

	// if (height < 0.0011) {
	// 	gl_FragColor = vec4(0.76, 0.87, 0.89, 1.0);
	// } else {
		 gl_FragColor = texture2D(u_image2, vec2(0.0, (bottom_gap - height)));
		// gl_FragColor = vec4(vec3(0.0, 0.6, 0.3) * height, 1.0);
	// }
}

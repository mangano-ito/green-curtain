/**
 * The fragment shader to apply mask
 */

varying vec2 vTexCoord;

uniform vec3 uMaskColor;
uniform vec3 uIntensity;
uniform vec2 uImageDimension;
uniform sampler2D uSampler;

vec3 rgb_to_hsv(vec3 color_rgb) {
 	float max_value = max(color_rgb.r, max(color_rgb.g, color_rgb.b));
 	float min_value = min(color_rgb.r, min(color_rgb.g, color_rgb.b));
 	float delta = max_value - min_value;

 	vec3 hsv = vec3(0.0, delta / max_value, max_value);

    // Hue
    const float EPS = 0.00001;
    if (abs(color_rgb.r - color_rgb.b) < EPS && abs(color_rgb.g - color_rgb.b) < EPS) {
        hsv.x = 0.0;
    } else if (abs(color_rgb.r - max_value) < EPS) {
        hsv.x = 60.0 * (color_rgb.g - color_rgb.b) / delta;
    } else if (abs(color_rgb.g - max_value) < EPS) {
        hsv.x = 60.0 * (color_rgb.b - color_rgb.r) / delta + 120.0;
    } else {
        hsv.x = 60.0 * (color_rgb.r - color_rgb.g) / delta + 240.0;
    }
    if (hsv.x < 0.0) {
        hsv.x += 360.0;
    }
    hsv.x /= 360.0;

 	return hsv;
}

vec4 fuzzy_color(vec2 position) {
    vec4 final_color = vec4(0.0);
    vec2 coord = position;
    const int kernel_size = 5;
    for (int x = 0; x < kernel_size; x++) {
        for (int y = 0; y < kernel_size; y++) {
            vec2 offset = vec2(x, y) / uImageDimension;
            final_color += texture2D(uSampler, coord + offset);
        }
    }

    return final_color / vec4(kernel_size * kernel_size);
}

bool should_mask(vec4 color) {
    vec3 mask_color_hsv = rgb_to_hsv(uMaskColor);
    vec3 color_hsv = rgb_to_hsv(color.rgb);
    vec3 mask_distance = vec3(
        min(
            abs(color_hsv.x - mask_color_hsv.x),
            abs(1.0 - color_hsv.x - mask_color_hsv.x)
        ),
        abs(color_hsv.y - mask_color_hsv.y),
        abs(color_hsv.z - mask_color_hsv.z)
    );

    return (
           mask_distance.x < uIntensity.x
        && mask_distance.y < uIntensity.y
        && mask_distance.z < uIntensity.z
    );
}

vec4 mask2() {
    vec2 coord = vTexCoord;
    float ok = 0.0;

    const int kernel_size = 5;
    for (int x = 0; x < kernel_size; x++) {
        for (int y = 0; y < kernel_size; y++) {
            vec2 offset = vec2(x, y) / uImageDimension;
            vec4 my_color = texture2D(uSampler, coord + offset);
            ok += should_mask(my_color) ? 1.0 : 0.0;
        }
    }
    ok /= float(kernel_size * kernel_size);
    vec4 color = texture2D(uSampler, vTexCoord);

    return (ok > 0.5)
        ? vec4(color.rgb, 0.0)
        : color;
}

vec4 mask() {
    vec4 color = texture2D(uSampler, vTexCoord);
    vec4 fuz_color = fuzzy_color(vTexCoord);

    return should_mask(fuz_color)
        ? vec4(color.rgb, 0.0)
        : color;
}

void main(void) {
    gl_FragColor = mask2();
}

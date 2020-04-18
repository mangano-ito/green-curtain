/**
 * dumb vertex shader
 * just transfer coordinates
 */

varying vec2 vTexCoord;

void main(void) {
    gl_Position = vec4(position, 1.0);
    vTexCoord = clamp(position.xy, 0.0, 1.0);
}

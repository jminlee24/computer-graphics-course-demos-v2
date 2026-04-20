"use strict";

//
// Shaders
//
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_color;

uniform mat4 u_matrix;

out vec3 v_color;
out vec3 world_pos;

void main() {
  world_pos = (u_matrix * a_position).xyz;
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;

const directionalShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_lightDir;

in vec3 v_color;
in vec3 world_p0s;
out vec4 outColor;

void main() {
  vec3 normal = vec3(0.0, 1.0, 0.0);
  float light = max(dot(normal, -normalize(u_lightDir)), .3);
  outColor = vec4(v_color * light, 1.0);
}
`;

const spotShaderSource = `
#version 300 es
precision highp float;

in vec3 v_color;
in vec3 world_pos;
out vec4 outColor;

void main() {
  outColor = vec4(v_color, 1.0);
}
`;

const pointShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_lightPos;

in vec3 v_color;
in vec3 world_pos;
out vec4 outColor;

void main() {
  outColor = vec4(v_color, 1.0);
}
`;

const textureShaderSource = `
#version 300 es
precision highp float;

in vec3 v_color;
out vec4 outColor;

void main(){
  outColor = vec4(v_color, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 v_color;
out vec4 outColor;

void main() {
  outColor = vec4(v_color, 1.0);
}
`;

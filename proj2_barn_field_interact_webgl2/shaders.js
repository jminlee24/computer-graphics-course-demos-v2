"use strict";

//
// Shaders
//
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_color;
in vec3 a_normal;

uniform mat4 u_world;
uniform mat4 u_matrix;
uniform mat4 u_invtr_world;

out vec3 v_color;
out vec3 v_normal;
out vec3 world_pos;

void main() {
  world_pos = (u_world * a_position).xyz;
  gl_Position = u_matrix * a_position;
  v_color = a_color;
  v_normal = normalize(mat3(u_invtr_world) * a_normal);
}
`;

const directionalShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_lightDir;

in vec3 v_color;
in vec3 world_p0s;
in vec3 v_normal;
out vec4 outColor;

void main() {
  vec3 normal = v_normal;
  float light = max(dot(normal, -normalize(u_lightDir)), .3);
  outColor = vec4(v_color * light, 1.0);
}
`;

const spotShaderSource = `
#version 300 es
precision highp float;

in vec3 v_color;
in vec3 world_pos;
in vec3 v_normal;
out vec4 outColor;

void main() {
  vec3 normal = v_normal;
  float s2l = dot(u_lightPos, world_pos, -normalize(u_lightDir));

  if(light >= .3){

}
  outColor = vec4(v_color, 1.0);
}
`;

const pointShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_lightPos;

in vec3 v_color;
in vec3 v_normal;
in vec3 world_pos;
out vec4 outColor;

void main() {
  vec3 s2l = normalize(u_lightPos - world_pos);
  float light = dot(s2l, normalize(v_normal));
  outColor = vec4(v_color * light, 1.0);
}
`;

const textureShaderSource = `
#version 300 es
precision highp float;

in vec3 v_color;
in vec3 v_normal;
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

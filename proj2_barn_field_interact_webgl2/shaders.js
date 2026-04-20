"use strict";

//
// Shaders
//
const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_color;
in vec3 a_normal;
in vec2 a_tex;

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
  v_tex = a_tex;
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

uniform vec3 u_lightDir;
uniform vec3 u_lightPos;

in vec3 v_color;
in vec3 v_normal;
in vec3 world_pos;

out vec4 outColor;

void main() {
  vec3 s2l = normalize(u_lightPos - world_pos);

  float dir = dot(s2l, normalize(u_lightDir));
  float light = 0.0;

  if(dir >= .3){
    light = dot(s2l, normalize(v_normal));
  }
  outColor = vec4(v_color * light, 1.0);
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
in vec2 v_tex;

out vec4 outColor;

uniform sampler2D u_texture;

void main(){
  outColor = texture(u_texture, v_texcoord);
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

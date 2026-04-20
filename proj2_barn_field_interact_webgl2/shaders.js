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
out vec2 v_tex;

void main() {
  world_pos = (u_world * a_position).xyz;
  gl_Position = u_matrix * a_position;
  v_color = a_color;
  v_normal = normalize(mat3(u_invtr_world) * a_normal);
  v_tex = a_tex;
}
`;

const diffuseShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_pointlightPos;
uniform vec3 u_spotlightDir;
uniform vec3 u_spotlightPos;
uniform vec3 u_dirlightDir;

in vec3 v_color;
in vec3 v_normal;
in vec2 v_tex;
in vec3 world_pos;

out vec4 outColor;

uniform sampler2D u_texture;

vec3 pointlight(){
  vec3 s2l = normalize(u_pointlightPos - world_pos);
  float light = dot(s2l, normalize(v_normal));

  return vec3(v_color * light);
}

vec3 spotlight(){
  vec3 s2l = normalize(u_spotlightPos - world_pos);

  float dir = dot(s2l, normalize(u_spotlightDir));
  float light = 0.0;

  if(dir >= .3){
    light = dot(s2l, normalize(v_normal));
  }

  return vec3(v_color * light);
}

vec3 dirlight(){
  float light = max(dot(normalize(v_normal), -normalize(u_dirlightDir)), .3);

  return vec3(v_color * light);
}

void main(){

  vec3 color = vec3(0.0);
  color += dirlight();
  color += pointlight();
  color += spotlight();

  outColor = vec4(color, 1.0); 
}
`;

const specularShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_pointlightPos;
uniform vec3 u_spotlightDir;
uniform vec3 u_spotlightPos;
uniform vec3 u_dirlightDir;
uniform vec3 u_viewPos;
uniform float u_shininess;

in vec3 v_color;
in vec3 v_normal;
in vec2 v_tex;
in vec3 world_pos;

out vec4 outColor;

uniform sampler2D u_texture;

vec3 pointlight(){
  vec3 viewDir = normalize(u_viewPos - world_pos);
  vec3 s2l = normalize(u_pointlightPos - world_pos);

  vec3 reflDir = reflect(-s2l, v_normal);
  float spec = pow(max(dot(viewDir, reflDir), 0.0), u_shininess);
  float diff = dot(s2l, normalize(v_normal));

  return vec3(v_color * (spec + diff));
}

vec3 spotlight(){
  vec3 s2l = normalize(u_spotlightPos - world_pos);


  float dir = dot(s2l, normalize(u_spotlightDir));
  float light = 0.0;

  if(dir >= .3){
    light = dot(s2l, normalize(v_normal));
  }

  return vec3(v_color * light);
}

vec3 dirlight(){
  vec3 viewDir = normalize(u_viewPos - world_pos);

  vec3 reflDir = reflect(-normalize(u_dirlightDir), v_normal);
  float spec = pow(max(dot(viewDir, reflDir), 0.0), u_shininess);
  float diff = max(dot(normalize(v_normal), -normalize(u_dirlightDir)), .3);

  return vec3(v_color * (spec + diff));
}

void main(){

  vec3 color = vec3(0.0);
  color += dirlight();
  color += pointlight();
  color += spotlight();

  outColor = vec4(color, 1.0); 
}
`;

const textureShaderSource = `
#version 300 es
precision highp float;

uniform vec3 u_pointlightPos;
uniform vec3 u_spotlightDir;
uniform vec3 u_spotlightPos;
uniform vec3 u_dirlightDir;

in vec3 v_color;
in vec3 v_normal;
in vec2 v_tex;
in vec3 world_pos;

out vec4 outColor;

uniform sampler2D u_texture;

vec3 pointlight(){
  vec3 s2l = normalize(u_pointlightPos - world_pos);
  float light = dot(s2l, normalize(v_normal));

  return vec3(texture(u_texture, v_tex) * light);
}

vec3 spotlight(){
  vec3 s2l = normalize(u_spotlightPos - world_pos);

  float dir = dot(s2l, normalize(u_spotlightDir));
  float light = 0.0;

  if(dir >= .3){
    light = dot(s2l, normalize(v_normal));
  }

  return vec3(texture(u_texture, v_tex) * light);
}

vec3 dirlight(){
  float light = max(dot(normalize(v_normal), -normalize(u_dirlightDir)), .3);

  return vec3(texture(u_texture, v_tex) * light);
}

void main(){

  vec3 color = vec3(0.0);
  color += dirlight();
  color += pointlight();
  color += spotlight();

  outColor = vec4(color, 1.0); 
}
`;

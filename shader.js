export const shader = ()=>{

    loadShader("test",
    `vec4 vert(vec3 pos, vec2 uv, vec4 color) {
    // predefined functions to get the default value by kaboom
    return def_vert();
}`,
`vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
    // turn everything blue-ish
    return def_frag() * vec4(0, 0, 1, 1);
}`, true);
add([
	rect(width()/2, height()/2),
	shader("test"),
	
	{
		update() {
			this.uniform["u_time"] = time();
			this.uniform["u_mpos"] = mousePos().scale(1 / width(), 1 / height());
		},
	}
]);


}


export default shader;
  
import * as THREE from 'three';

import VERTEX_SHADER from '#/Shader/vertex.glsl';
import FRAGMENT_SHADER from '#/Shader/fragment.glsl';

/**
 * color-masked video renderer
 */
export default class Renderer {
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.Camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -100, 100);
    private renderer: THREE.Renderer;
    private shaderMaterial: THREE.ShaderMaterial;

    private maskColor: THREE.Color = new THREE.Color('#ffffff');
    private intensity: THREE.Vector3 = new THREE.Vector3(0.2, 0.7, 0.8);
    private dimension: THREE.Vector2 = new THREE.Vector2(1, 1);

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = this.setUpRenderer(canvas);
        this.shaderMaterial = this.setUpShaderMaterial();
        this.updateDimension();
    }

    /**
     * render scene periodically
     */
    startRendering() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.startRendering());
    }

    /**
     * update mask color
     * @param colorString color in hex (e.g. #ffffff)
     */
    updateMaskColor(colorString: string) {
        this.shaderMaterial.uniforms['uMaskColor'].value = new THREE.Color(colorString);
        this.shaderMaterial.uniformsNeedUpdate = true;
    }

    /**
     * update mask intensity
     * @param intensityH intensity of mask on Hue (0.0 to 1.0)
     * @param intensityS intensity of mask on Saturation (0.0 to 1.0)
     * @param intensityV intensity of mask on Value (0.0 to 1.0)
     */
    updateIntensity(intensityH: number, intensityS: number, intensityV: number) {
        this.shaderMaterial.uniforms['uIntensity'].value = new THREE.Vector3(
            intensityH,
            intensityS,
            intensityV,
        );
        this.shaderMaterial.uniformsNeedUpdate = true;
    }

    /**
     * update canvas dimension
     */
    updateDimension() {
        const [viewportWidth, viewportHeight] = [window.innerWidth, window.innerHeight];
        const viewportAspectRatio = viewportWidth / viewportHeight;
        const videoAspectRatio = this.dimension.width / this.dimension.height;

        if (viewportAspectRatio >= 1.0) {
            this.renderer.setSize(
                viewportHeight * videoAspectRatio,
                viewportHeight,
                true
            );
        } else {
            this.renderer.setSize(
                viewportWidth,
                viewportWidth / videoAspectRatio,
                true
            );
        }
    }

    updateVideo(videoElement: HTMLVideoElement) {
        this.shaderMaterial.uniforms['uSampler'].value = new THREE.VideoTexture(videoElement);
        this.dimension = new THREE.Vector2(videoElement.videoWidth, videoElement.videoHeight);
        this.shaderMaterial.uniforms['uImageDimension'].value = this.dimension;
        this.shaderMaterial.uniformsNeedUpdate = true;
        this.updateDimension();
    }

    private setUpRenderer(canvas: HTMLCanvasElement) {
        const renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true, alpha: true, });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);

        return renderer;
    }

    private setUpShaderMaterial() {
        const texture = new THREE.Texture();
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'uSampler': {
                    value: texture,
                },
                'uMaskColor': {
                    value: this.maskColor,
                },
                'uIntensity': {
                    value: this.intensity,
                },
                'uImageDimension': {
                    value: this.dimension,
                },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const object = new THREE.Mesh(geometry, shaderMaterial);

        object.position.set(0, 0, 0);
        this.scene.add(object);

        this.camera.position.set(0, 0, -50);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        return shaderMaterial;
    }
}

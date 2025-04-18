import * as THREE from 'three';

export function playDreamTransition(callback: () => void, containerId = 'game-container') {
    const container = document.getElementById(containerId);
    console.log("this ithe container",container)
    if (!container) {
        console.error('Conteneur non trouvé:', containerId);
        callback();
        return;
    }
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
        -width / 2, width / 2,
        height / 2, -height / 2,
        1, 1000
    );
    camera.position.z = 10;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 1
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    let opacity = 1;
    const fadeOut = () => {
        opacity -= 0.05;
        material.opacity = opacity;
        renderer.render(scene, camera);
        if (opacity > 0) {
            requestAnimationFrame(fadeOut);
        } else {
            container.removeChild(renderer.domElement);
            callback();
        }
    };

    renderer.render(scene, camera);
    setTimeout(() => {
        requestAnimationFrame(fadeOut);
    }, 200);
}

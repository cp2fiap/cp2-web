const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Luz
scene.add(new THREE.AmbientLight(0xffffff, 2));

// Controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Modelos
const modelos = ["modelo1.glb", "modelo2.glb", "modelo3.glb"];
let modeloAtual = 0;
let modeloCarregado = null;

const loader = new THREE.GLTFLoader();

function carregarModelo(index) {
  if (modeloCarregado) {
    scene.remove(modeloCarregado);
    modeloCarregado.traverse(child => {
      if (child.isMesh) child.geometry.dispose();
    });
  }

  loader.load(modelos[index], gltf => {
    modeloCarregado = gltf.scene;
    modeloCarregado.scale.set(1, 1, 1);
    scene.add(modeloCarregado);
  }, undefined, error => {
    console.error('Erro ao carregar modelo:', error);
  });
}

carregarModelo(modeloAtual);

// Botões
document.getElementById("prev").onclick = () => {
  modeloAtual = (modeloAtual - 1 + modelos.length) % modelos.length;
  carregarModelo(modeloAtual);
};

document.getElementById("next").onclick = () => {
  modeloAtual = (modeloAtual + 1) % modelos.length;
  carregarModelo(modeloAtual);
};

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsivo
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
